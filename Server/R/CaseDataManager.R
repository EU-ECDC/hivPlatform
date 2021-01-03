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
      print(self$Session)
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadData = function(
      fileName,
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 0) {
        PrintAlert(
          'CaseDataManager is not initialized properly before reading data',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      tryCatch({
        originalData <- ReadDataFile(fileName)
        attrMapping <- GetPreliminaryAttributesMapping(originalData)
        attrMappingStatus <- GetAttrMappingStatus(attrMapping)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Reinitialize('ReadData')
        private$Catalogs$FileName <- fileName
        private$Catalogs$OriginalData <- originalData
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$Catalogs$LastStep <- 1L
        PrintAlert('Data file {.file {fileName}} loaded')
      } else {
        PrintAlert('Loading data file {.file {fileName}} failed', type = 'danger')
      }

      payload <- list(
        type = 'CaseDataManager:ReadData',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    # 2. Apply attribute mapping -------------------------------------------------------------------
    ApplyAttributesMapping = function(
      attrMapping,
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 1) {
        PrintAlert('Data must be read before applying atrributes mapping', type = 'danger')
        return(invisible(self))
      }

      originalData <- private$Catalogs$OriginalData
      status <- 'SUCCESS'
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
          }
        }
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS' && attrMappingStatus$Valid && dataStatus$Valid) {
        private$Reinitialize('ApplyAttributesMapping')
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$Catalogs$OriginDistribution <- originDistribution
        private$Catalogs$PreProcessArtifacts <- preProcessArtifacts
        private$Catalogs$PreProcessedData <- data
        private$Catalogs$PreProcessedDataStatus <- dataStatus
        private$Catalogs$LastStep <- 2L
        PrintAlert('Attribute mapping has been applied')
      } else {
        PrintAlert('Attribute mapping is not valid and cannot be applied', type = 'danger')
      }

      payload <- list(
        type = 'CaseDataManager:ApplyAttributesMapping',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    # 3. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(
      originGrouping,
      type = 'CUSTOM',
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 2) {
        PrintAlert(
          'Atrributes mapping must be applied before applying origin grouping',
          type = 'danger'
        )
        return(invisible(self))
      }

      originDistribution <- private$Catalogs$OriginDistribution
      preProcessedData <- private$Catalogs$PreProcessedData

      status <- 'SUCCESS'
      tryCatch({
        if (missing(originGrouping)) {
          originGrouping <- GetOriginGroupingPreset(type, originDistribution)
        } else {
          type <- 'CUSTOM'
        }
        ApplyOriginGrouping(preProcessedData, originGrouping)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Reinitialize('ApplyOriginGrouping')
        private$Catalogs$OriginGrouping <- originGrouping
        private$Catalogs$PreProcessedData <- preProcessedData
        private$Catalogs$LastStep <- 3L
        PrintAlert('Origin grouping {.val {type}} has been applied')
        private$ComputeSummary()
      } else {
        PrintAlert('Origin grouping cannot be applied', type = 'danger')
      }

      payload <- list(
        type = 'CaseDataManager:ApplyOriginGrouping',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    # 4. Adjust data -------------------------------------------------------------------------------
    RunAdjustments = function(
      adjustmentSpecs,
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 3) {
        PrintAlert(
          'Origing grouping must be applied before running adjustments',
          type = 'danger'
        )
        return(invisible(self))
      }

      preProcessedData <- private$Catalogs$PreProcessedData

      PrintAlert('Starting adjustment task')
      status <- 'SUCCESS'
      private$Reinitialize('RunAdjustments')
      tryCatch({
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
            PrintAlert('Running adjustment task finished')
          },
          failCallback = function() {
            PrintAlert('Running adjustment task failed', type = 'danger')
          }
        )
      },
      error = function(e) {
        status <- 'FAIL'
        print(e)
      })

      payload <- list(
        type = 'CaseDataManager:RunAdjustments',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
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

    Reinitialize = function(step) {
      if (
        step %in% c('ReadData')
      ) {
        private$Catalogs$FileName <- NULL
        private$Catalogs$OriginalData <- NULL
        private$Catalogs$AttrMapping <- NULL
        private$Catalogs$AttrMappingStatus <- NULL
      }

      if (
        step %in% c('ReadData', 'ApplyAttributeMapping')
      ) {
        private$Catalogs$AttrMapping <- NULL
        private$Catalogs$AttrMappingStatus <- NULL
        private$Catalogs$PreProcessArtifacts <- NULL
        private$Catalogs$OriginDistribution <- NULL
        private$Catalogs$PreProcessedData <- NULL
        private$Catalogs$PreProcessedDataStatus <- NULL
      }

      if (
        step %in% c('ReadData', 'ApplyAttributeMapping', 'ApplyOriginGrouping')
      ) {
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$Summary <- NULL
        if ('GroupedRegionOfOrigin' %in% colnames(private$Catalogs$PreProcessedData$Table)) {
          private$Catalogs$PreProcessedData$Table[, GroupedRegionOfOrigin := NULL]
        }
      }

      if (
        step %in% c('ReadData', 'ApplyAttributeMapping', 'ApplyOriginGrouping', 'RunAdjustments')
      ) {
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
      }

      lastStep <- switch(
        step,
        'ReadData' = 0L,
        'ApplyAttributeMapping' = 1L,
        'ApplyOriginGrouping' = 2L,
        'RunAdjustments' = 3L
      )
      private$Catalogs$LastStep <- lastStep
    },

    ComputeSummary = function() {
      if (private$Catalogs$LastStep < 3) {
        PrintAlert(
          'Origin grouping must be applied before computing summary data',
          type = 'danger'
        )
        return(invisible(self))
      }

      data <- private$Catalogs$PreProcessedData
      status <- 'SUCCESS'
      tryCatch({
        # Diagnosis year plot
        diagYearCounts <- data[, .(Count = .N), keyby = .(Gender, YearOfHIVDiagnosis)]
        diagYearCategories <- sort(unique(diagYearCounts$YearOfHIVDiagnosis))
        diagYearPlotData <- list(
          filter = list(
            scaleMinYear = min(diagYearCategories),
            scaleMaxYear = max(diagYearCategories),
            valueMinYear = min(diagYearCategories),
            valueMaxYear = max(diagYearCategories)
          ),
          chartCategories = diagYearCategories,
          chartData = list(
            list(
              name = 'Female',
              data = diagYearCounts[Gender == 'F', Count]
            ),
            list(
              name = 'Male',
              data = diagYearCounts[Gender == 'M', Count]
            )
          )
        )

        # Notification quarter plot
        notifQuarterCounts <- data[,
          .(Count = .N),
          keyby = .(
            Gender,
            QuarterOfNotification = year(DateOfNotification) + quarter(DateOfNotification) / 4
          )
        ]
        notifQuarterCategories <- sort(unique(notifQuarterCounts$QuarterOfNotification))
        notifQuarterPlotData <- list(
          filter = list(
            scaleMinYear = min(notifQuarterCategories),
            scaleMaxYear = max(notifQuarterCategories),
            valueMinYear = min(notifQuarterCategories),
            valueMaxYear = max(notifQuarterCategories)
          ),
          chartCategories = notifQuarterCategories,
          chartData = list(
            list(
              name = 'Female',
              data = notifQuarterCounts[Gender == 'F', Count]
            ),
            list(
              name = 'Male',
              data = notifQuarterCounts[Gender == 'M', Count]
            )
          )
        )

        missPlotData <- GetMissingnessPlots(data)

        repDelPlotData <- GetReportingDelaysPlots(data)

        summary <- list(
          DiagYearPlotData = diagYearPlotData,
          NotifQuarterPlotData = notifQuarterPlotData,
          MissPlotData = missPlotData,
          RepDelPlotData = repDelPlotData
        )
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$Summary <- summary
      } else {
        PrintAlert('Summary cannot be computed', type = 'danger')
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
