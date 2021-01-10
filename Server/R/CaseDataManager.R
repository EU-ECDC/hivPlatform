#' CaseDataManager
#'
#' R6 class for representing the case-based data manaager
#'
#' @name CaseDataManager
#' @examples
#' caseMgr <- CaseDataManager$new()
NULL

#' @export
CaseDataManager <- R6::R6Class(
  classname = 'CaseDataManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL,
      appMgr = NULL
    ) {
      private$AppMgr <- appMgr
      private$Session <- session
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        FileName = NULL,
        OriginalData = NULL,
        AttrMapping = NULL,
        AttrMappingStatus = NULL,
        OriginDistribution = NULL,
        OriginGrouping = list(),
        PreProcessArtifacts = NULL,
        Summary = NULL,
        PreProcessedData = NULL,
        PreProcessedDataStatus = NULL,
        AdjustedData = NULL,
        AdjustmentTask = NULL,
        AdjustmentResult = NULL,
        LastStep = 0L
      )
    },

    print = function() {
      print('CaseDataManager')
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadData = function(
      fileName
    ) {
      if (private$Catalogs$LastStep < 0) {
        PrintAlert(
          'CaseDataManager is not initialized properly before reading data',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      msg <- 'Data read correctly'
      tryCatch({
        originalData <- ReadDataFile(fileName)
        attrMapping <- GetPreliminaryAttributesMapping(originalData)
        attrMappingStatus <- GetAttrMappingStatus(attrMapping)
      },
      error = function(e) {
        status <- 'FAIL'
        msg <- 'There was a difficulty encountered when reading the data. It has not been loaded.'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$FileName <- fileName
        private$Catalogs$OriginalData <- originalData
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$Catalogs$LastStep <- 1L
        private$Reinitialize('ReadData')
        PrintAlert('Data file {.file {fileName}} loaded')
        payload <- list(
          ColumnNames = colnames(originalData),
          RecordCount = nrow(originalData),
          AttrMapping = unname(attrMapping),
          AttrMappingStatus = attrMappingStatus
        )
      } else {
        PrintAlert('Loading data file {.file {fileName}} failed', type = 'danger')
        payload <- list()
      }

      private$SendMessage('CASE_BASED_DATA_READ', status, msg, payload)

      return(invisible(self))
    },

    # 2. Apply attributes mapping ------------------------------------------------------------------
    ApplyAttributesMapping = function(
      attrMapping
    ) {
      private$SendMessage('CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START', 'SUCCESS')

      if (private$Catalogs$LastStep < 1) {
        PrintAlert('Data must be read before applying atrributes mapping', type = 'danger')
        return(invisible(self))
      }

      originalData <- private$Catalogs$OriginalData
      status <- 'SUCCESS'
      msg <- 'Attributes applied correctly'
      tryCatch({
        if (missing(attrMapping)) {
          attrMapping <- GetPreliminaryAttributesMapping(originalData)
        }
        attrMappingStatus <- GetAttrMappingStatus(attrMapping)

        if (attrMappingStatus$Valid) {
          data <- ApplyAttributesMapping(originalData, attrMapping)
          preProcessArtifacts <- PreProcessInputDataBeforeSummary(data)
          PreProcessInputDataBeforeAdjustments(data)
          dataStatus <- GetInputDataValidityStatus(data)
          if (dataStatus$Valid) {
            originDistribution <- GetOriginDistribution(data)
            originGroupingType <- 'REPCOUNTRY + UNK + OTHER'
            origingGrouping <- GetOriginGroupingPreset(originGroupingType, originDistribution)
          } else {
            msg <- 'Data pre-processing did not succeed'
            status <- 'FAIL'
          }
        } else {
          msg <- 'Attributes mapping has invalid status'
          status <- 'FAIL'
        }
      },
      error = function(e) {
        msg <- 'Attributes mapping failed'
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$Catalogs$OriginDistribution <- originDistribution
        private$Catalogs$PreProcessArtifacts <- preProcessArtifacts
        private$Catalogs$PreProcessedData <- data
        private$Catalogs$PreProcessedDataStatus <- dataStatus
        private$Catalogs$LastStep <- 2L
        private$Reinitialize('ApplyAttributesMapping')
        PrintAlert('Attribute mapping has been applied')
        payload <- list(
          OriginDistribution = originDistribution,
          OriginGroupingType = originGroupingType,
          OriginGrouping = origingGrouping
        )
      } else {
        PrintAlert('Attribute mapping is not valid and cannot be applied', type = 'danger')
        payload <- list()
      }

      private$SendMessage('CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END', status, msg, payload)
      return(invisible(self))
    },

    # 3. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(
      originGrouping,
      type = 'CUSTOM'
    ) {
      if (private$Catalogs$LastStep < 2) {
        PrintAlert(
          'Atrributes mapping must be applied before applying origin grouping',
          type = 'danger'
        )
        return(invisible(self))
      }

      originDistribution <- private$Catalogs$OriginDistribution
      preProcessedData <- copy(private$Catalogs$PreProcessedData)

      status <- 'SUCCESS'
      tryCatch({
        if (missing(originGrouping)) {
          originGrouping <- GetOriginGroupingPreset(type, originDistribution)
        } else {
          type <- 'CUSTOM'
        }
        ApplyOriginGrouping(preProcessedData, originGrouping)
        summary <- GetCaseDataSummary(preProcessedData)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$OriginGrouping <- originGrouping
        private$Catalogs$PreProcessedData <- preProcessedData
        private$Catalogs$Summary <- summary
        private$Catalogs$LastStep <- 3L
        private$Reinitialize('ApplyOriginGrouping')
        PrintAlert('Origin grouping {.val {type}} has been applied')
      } else {
        PrintAlert('Origin grouping cannot be applied', type = 'danger')
      }

      private$SendMessage('CASE_BASED_DATA_ORIGIN_GROUPING_SET', status)

      return(invisible(self))
    },

    # 4. Adjust data -------------------------------------------------------------------------------
    RunAdjustments = function(
      adjustmentSpecs
    ) {
      if (private$Catalogs$LastStep < 3) {
        PrintAlert(
          'Origing grouping must be applied before running adjustments',
          type = 'danger'
        )
        return(invisible(self))
      }

      tryCatch({
        PrintAlert('Starting adjustment task')

        preProcessedData <- private$Catalogs$PreProcessedData

        private$Catalogs$AdjustmentTask <- Task$new(
          function(data, adjustmentSpecs) {
            suppressMessages(pkgload::load_all())
            options(width = 100)
            result <- hivEstimatesAccuracy2::RunAdjustments(
              data = data,
              adjustmentSpecs = adjustmentSpecs,
              diagYearRange = NULL,
              notifQuarterRange = NULL,
              seed = NULL
            )
            return(result)
          },
          args = list(data = preProcessedData, adjustmentSpecs = adjustmentSpecs),
          session = private$Session,
          successCallback = function(result) {
            private$Catalogs$AdjustmentResult <- result
            private$Catalogs$AdjustedData <- self$LastAdjustmentResult$Data[Imputation != 0]
            private$Catalogs$LastStep <- 4L
            private$Reinitialize('RunAdjustments')
            PrintAlert('Running adjustment task finished')
            private$SendMessage('ADJUSTMENTS_RUN_FINISHED', 'SUCCESS')
          },
          failCallback = function() {
            PrintAlert('Running adjustment task failed', type = 'danger')
            private$SendMessage('ADJUSTMENTS_RUN_FINISHED', 'FAIL')
          }
        )
        private$SendMessage('ADJUSTMENTS_RUN_STARTED', 'SUCCESS')
      },
      error = function(e) {
        private$SendMessage('ADJUSTMENTS_RUN_STARTED', 'FAIL')
        print(e)
      })

      return(invisible(self))
    },

    CancelAdjustments = function(
      callback = NULL
    ) {
      if (!is.null(private$Catalogs$AdjustmentTask)) {
        private$Catalogs$AdjustmentTask$Stop()
      }

      return(invisible(self))
    }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Parent application manager
    AppMgr = NULL,

    # Storage
    Catalogs = NULL,

    SendMessage = function(...) {
      if (is.function(private$AppMgr$SendMessage)) {
        private$AppMgr$SendMessage(...)
      }
    },

    Reinitialize = function(step) {
      if (
        step %in% c('ReadData')
      ) {
        private$Catalogs$OriginDistribution <- NULL
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$PreProcessArtifacts <- NULL
        private$Catalogs$Summary <- NULL
        private$Catalogs$PreProcessedData <- NULL
        private$Catalogs$PreProcessedDataStatus <- NULL
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
        if ('GroupedRegionOfOrigin' %in% colnames(private$Catalogs$PreProcessedData$Table)) {
          private$Catalogs$PreProcessedData$Table[, GroupedRegionOfOrigin := NULL]
        }
      }

      if (
        step %in% c('ApplyAttributeMapping')
      ) {
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$Summary <- NULL
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
        if ('GroupedRegionOfOrigin' %in% colnames(private$Catalogs$PreProcessedData$Table)) {
          private$Catalogs$PreProcessedData$Table[, GroupedRegionOfOrigin := NULL]
        }
      }

      if (
        step %in% c('ApplyOriginGrouping')
      ) {
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
      }
      return(invisible(self))
    }
  ),

  active = list(
    FileName = function() {
      return(private$Catalogs$FileName)
    },

    OriginalData = function() {
      return(private$Catalogs$OriginalData)
    },

    AttrMapping = function() {
      return(private$Catalogs$AttrMapping)
    },

    AttrMappingStatus = function() {
      return(private$Catalogs$AttrMappingStatus)
    },

    OriginDistribution = function() {
      return(private$Catalogs$OriginDistribution)
    },

    OriginGrouping = function() {
      return(private$Catalogs$OriginGrouping)
    },

    PreProcessArtifacts = function() {
      return(private$Catalogs$PreProcessArtifacts)
    },

    Summary = function() {
      return(private$Catalogs$Summary)
    },

    SummaryJSON = function() {
      summaryJSON <- jsonlite:::asJSON(private$Catalogs$Summary, keep_vec_names = TRUE)
      return(summaryJSON)
    },

    PreProcessedData = function() {
      return(private$Catalogs$PreProcessedData)
    },

    PreProcessedDataStatus = function() {
      return(private$Catalogs$PreProcessedDataStatus)
    },

    AdjustedData = function() {
      return(private$Catalogs$AdjustedData)
    },

    AdjustmentTask = function() {
      return(private$Catalogs$AdjustmentTask)
    },

    AdjustmentResult = function() {
      return(private$Catalogs$AdjustmentResult)
    },

    LastAdjustmentResult = function() {
      if (is.list(private$Catalogs$AdjustmentResult)) {
        result <- private$Catalogs$AdjustmentResult[[length(private$Catalogs$AdjustmentResult)]]
      } else {
        result <- NULL
      }

      return(result)
    },

    Data = function() {
      if (!is.null(private$Catalogs$AdjustedData)) {
        data <- private$Catalogs$AdjustedData
      } else {
        data <- private$Catalogs$PreProcessedData
      }
      return(data)
    },

    LastStep = function() {
      return(private$Catalogs$LastStep)
    }
  )
)
