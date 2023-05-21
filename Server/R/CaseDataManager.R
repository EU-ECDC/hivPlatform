#' CaseDataManager
#'
#' R6 class for representing the case-based data manaager
#'
#' @name CaseDataManager
#' @examples
#' caseMgr <- CaseDataManager$new()
NULL

#' @export
CaseDataManager <- R6::R6Class( # nolint
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
        FilePath = NULL,
        FileName = NULL,
        OriginalData = NULL,
        AttrMapping = NULL,
        AttrMappingStatus = NULL,
        OriginDistribution = NULL,
        OriginGrouping = list(),
        PreProcessArtifacts = NULL,
        Filters = NULL,
        PreProcessedData = NULL,
        PreProcessedDataStatus = NULL,
        AdjustedData = NULL,
        AdjustmentTask = NULL,
        AdjustmentResult = NULL,
        MigrationRegion = 'ALL',
        MigrationPropStrat = c('Total'),
        MigrationTask = NULL,
        MigrationResult = NULL
      )
      private$Observers <- NULL
      private$CreateObservers()
    },

    print = function() {
      print('CaseDataManager')
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadData = function(
      filePath,
      fileName = NULL
    ) {
      if (!is.null(private$AppMgr) && !is.element(
        private$AppMgr$Steps['SESSION_INITIALIZED'],
        private$AppMgr$CompletedSteps
      )) {
        PrintAlert(
          'AppManager is not initialized properly before reading data',
          type = 'danger'
        )
        return(invisible(self))
      }

      if (is.null(fileName)) {
        fileName <- basename(filePath)
      }
      status <- 'SUCCESS'
      msg <- 'Data read correctly'
      tryCatch({
        originalData <- ReadDataFile(filePath)
        attrMapping <- GetPreliminaryAttributesMapping(originalData)
        attrMappingStatus <- GetAttrMappingStatus(attrMapping)
      },
      error = function(e) {
        status <<- 'FAIL'
        msg <<- e$message
      })

      if (status == 'SUCCESS') {
        private$Catalogs$FilePath <- filePath
        private$Catalogs$FileName <- fileName
        private$Catalogs$OriginalData <- originalData
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$InvalidateAfterStep('CASE_BASED_READ')
        PrintAlert('Data file {.file {fileName}} loaded')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg,
          ColumnNames = colnames(originalData),
          RecordCount = nrow(originalData),
          AttrMapping = unname(attrMapping),
          AttrMappingStatus = attrMappingStatus
        )
      } else {
        PrintAlert('Loading data file {.file {fileName}} failed', type = 'danger')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg
        )
      }

      private$SendMessage('CASE_BASED_DATA_READ', payload)

      return(invisible(self))
    },

    UnloadData = function() {
      print('Unloading data')
      private$SendMessage('CASE_BASED_DATA_UNLOADED', list())
    },

    # 2. Apply attributes mapping ------------------------------------------------------------------
    ApplyAttributesMapping = function(
      attrMapping
    ) {
      private$SendMessage(
        'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START',
        list(ActionStatus = 'SUCCESS')
      )

      if (!is.null(private$AppMgr) && !is.element(
        private$AppMgr$Steps['CASE_BASED_READ'], private$AppMgr$CompletedSteps
      )) {
        PrintAlert('Data must be read before applying atrributes mapping', type = 'danger')
        return(invisible(self))
      }

      status <- 'SUCCESS'
      msg <- 'Attributes applied correctly'
      tryCatch({
        originalData <- private$Catalogs$OriginalData
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
            originGroupingPreset <- 'REPCOUNTRY + UNK + OTHER'
            origingGrouping <- GetOriginGroupingPreset(originGroupingPreset, originDistribution)
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
        msg <<- sprintf('Applying attributes mapping failed: %s', e$message)
        status <<- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$AttrMapping <- attrMapping
        private$Catalogs$AttrMappingStatus <- attrMappingStatus
        private$Catalogs$OriginDistribution <- originDistribution
        private$Catalogs$PreProcessArtifacts <- preProcessArtifacts
        private$Catalogs$PreProcessedData <- data
        private$Catalogs$PreProcessedDataStatus <- dataStatus
        private$InvalidateAfterStep('CASE_BASED_ATTR_MAPPING')
        PrintAlert('Attribute mapping has been applied')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg,
          OriginDistribution = originDistribution,
          OriginGroupingPreset = originGroupingPreset,
          OriginGrouping = origingGrouping
        )
      } else {
        PrintAlert(msg, type = 'danger')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg
        )
      }

      private$SendMessage('CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END', payload)
      return(invisible(self))
    },

    # 3. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(
      originGrouping,
      originGroupingPreset = 'Custom'
    ) {
      if (!is.null(private$AppMgr) && !is.element(
        private$AppMgr$Steps['CASE_BASED_ATTR_MAPPING'],
        private$AppMgr$CompletedSteps
      )) {
        PrintAlert(
          'Atrributes mapping must be applied before applying origin grouping',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      msg <- 'Origin grouping applied correctly'
      tryCatch({
        if (missing(originGrouping)) {
          originDistribution <- private$Catalogs$OriginDistribution
          originGrouping <- GetOriginGroupingPreset(originGroupingPreset, originDistribution)
        }
        preProcessedData <- ApplyGrouping(
          copy(private$Catalogs$PreProcessedData),
          originGrouping,
          from = 'FullRegionOfOrigin',
          to = 'GroupedRegionOfOrigin'
        )
        ApplyGrouping(
          preProcessedData,
          originGrouping,
          from = 'GroupedRegionOfOrigin',
          to = 'MigrantRegionOfOrigin',
          asFactor = TRUE
        )

        migrantCompatibility <- CheckOriginGroupingForMigrant(originGrouping)

        summaryFilterPlots <- GetCaseDataSummaryFilterPlots(preProcessedData)
      },
      error = function(e) {
        status <<- 'FAIL'
        msg <<- 'Applying origin grouping failed'
      })

      if (status == 'SUCCESS') {
        private$Catalogs$OriginGrouping <- originGrouping
        private$Catalogs$PreProcessedData <- preProcessedData
        private$InvalidateAfterStep('CASE_BASED_ORIGIN_GROUPING')
        PrintAlert('Origin grouping preset {.val {originGroupingPreset}} has been applied')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg,
          Summary = summaryFilterPlots,
          MigrantCompatibility = migrantCompatibility
        )
        if (is.function(private$AppMgr$HIVModelMgr$DetermineYearRanges)) {
          private$AppMgr$HIVModelMgr$DetermineYearRanges()
        }
      } else {
        PrintAlert('Origin grouping cannot be applied', type = 'danger')
        payload <- list(
          ActionStatus = status,
          ActionMessage = msg
        )
      }

      private$SendMessage('CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED', payload)

      return(invisible(self))
    },

    # 4. Set filters -------------------------------------------------------------------------------
    SetFilters = function(
      filters
    ) {
      private$Catalogs$Filters <- filters
      PrintAlert('Case-based data filters set')

      # Update summary plots
      tryCatch({
        data <- FilterCaseBasedData(
          private$Catalogs$PreProcessedData,
          private$Catalogs$Filters
        )
        if (is.null(data)) {
          return(NULL)
        }

        missPlotData <- GetMissingnessPlots(data)
        repDelPlotData <- GetReportingDelaysPlots(data)

        summary <- list(
          SelectedCount = nrow(data),
          TotalCount = nrow(private$Catalogs$PreProcessedData),
          MissPlotData = missPlotData,
          RepDelPlotData = repDelPlotData
        )

        private$AppMgr$SendMessage(
          type = 'CASE_BASED_SUMMARY_DATA_PREPARED',
          payload = list(
            ActionStatus = 'SUCCESS',
            ActionMessage = 'Summary has been prepared',
            Summary = summary
          )
        )

        PrintAlert('Summary plots created')
        private$AppMgr$SetCompletedStep('CASE_BASED_SUMMARY')

      },
      error = function(e) {
        private$SendMessage(
          type = 'CASE_BASED_SUMMARY_DATA_PREPARED',
          payload = list(
            ActionStatus = 'FAIL',
            ActionMessage = 'Summary has not been prepared'
          )
        )
      })

      # Determine allowed year ranges for HIV model
      if (is.function(private$AppMgr$HIVModelMgr$DetermineYearRanges)) {
        private$AppMgr$HIVModelMgr$DetermineYearRanges()
      }
    },

    # 5. Adjust data -------------------------------------------------------------------------------
    RunAdjustments = function(
      adjustmentSpecs
    ) {
      if (!is.null(private$AppMgr) && !is.element(
        private$AppMgr$Steps['CASE_BASED_ORIGIN_GROUPING'],
        private$AppMgr$CompletedSteps
      )) {
        PrintAlert(
          'Origing grouping must be applied before running adjustments',
          type = 'danger'
        )
        return(invisible(self))
      }

      tryCatch({
        PrintAlert('Starting adjustment task')

        data <- private$Catalogs$PreProcessedData
        filters <- private$Catalogs$Filters

        if (isTRUE(filters$DiagYear$ApplyInAdjustments)) {
          diagYearRange <- c(
            filters$DiagYear$MinYear,
            filters$DiagYear$MaxYear
          )

          data  <- data[is.na(YearOfHIVDiagnosis) | YearOfHIVDiagnosis %between% diagYearRange]
        }

        if (isTRUE(filters$NotifQuarter$ApplyInAdjustments)) {
          notifQuarterRange <- c(
            filters$NotifQuarter$MinYear,
            filters$NotifQuarter$MaxYear
          )

          data <- data[is.na(NotificationTime) | NotificationTime %between% notifQuarterRange]
        }

        if (nrow(data) > 0) {
          private$Catalogs$AdjustmentTask <- Task$new(
            function(data, adjustmentSpecs, randomSeed) {
              if (!requireNamespace('hivPlatform', quietly = TRUE)) {
                suppressMessages(pkgload::load_all())
              }
              options(width = 120)
              .Random.seed <- randomSeed # nolint

              result <- hivPlatform::RunAdjustments(
                data = data,
                adjustmentSpecs = adjustmentSpecs,
                diagYearRange = NULL,
                notifQuarterRange = NULL,
                seed = NULL
              )

              return(result)
            },
            args = list(
              data = data,
              adjustmentSpecs = adjustmentSpecs,
              randomSeed = .Random.seed
            ),
            session = private$Session,
            successCallback = function(result) {
              private$Catalogs$AdjustmentResult <- result

              data <- ApplyGrouping(
                copy(self$LastAdjustmentResult$Data),
                private$Catalogs$OriginGrouping,
                from = 'GroupedRegionOfOrigin',
                to = 'MigrantRegionOfOrigin',
                asFactor = TRUE
              )
              private$Catalogs$AdjustedData <- data

              private$InvalidateAfterStep('CASE_BASED_ADJUSTMENTS')
              cat('\n')
              PrintAlert('Adjustment task finished')
              private$SendMessage(
                'ADJUSTMENTS_RUN_FINISHED',
                payload = list(
                  ActionStatus = 'SUCCESS',
                  ActionMessage = 'Adjustment task finished',
                  AdjustmentsReport = self$AdjustmentsReport,
                  RunAdjustmentsTypes = unname(sapply(adjustmentSpecs, '[[', 'Type'))
                )
              )
            },
            failCallback = function(msg = NULL) {
              if (!is.null(msg)) {
                PrintAlert(msg, type = 'danger')
              }
              PrintAlert('Adjustment task failed', type = 'danger')
              private$SendMessage(
                'ADJUSTMENTS_RUN_FINISHED',
                payload = list(
                  ActionStatus = 'FAIL',
                  ActionMessage = 'Adjustment task failed'
                )
              )
            }
          )
          private$SendMessage(
            'ADJUSTMENTS_RUN_STARTED',
            payload = list(
              ActionStatus = 'SUCCESS',
              ActionMessage = 'Adjustment task started'
            )
          )
        }
      },
      error = function(e) {
        private$SendMessage(
          'ADJUSTMENTS_RUN_STARTED',
          payload = list(
            ActionStatus = 'FAIL',
            ActionMessage = 'Adjustment task failed'
          )
        )
        print(e)
      })

      return(invisible(self))
    },

    # 6. Cancel adjustments ------------------------------------------------------------------------
    CancelAdjustments = function() {
      if (!is.null(private$Catalogs$AdjustmentTask)) {
        private$Catalogs$AdjustmentTask$Stop()

        private$SendMessage(
          'ADJUSTMENTS_RUN_CANCELLED',
          payload = list(
            ActionStatus = 'SUCCESS',
            ActionMessage = 'Running adjustment task cancelled'
          )
        )
      }

      return(invisible(self))
    },

    # 7. Migration ---------------------------------------------------------------------------------
    RunMigration = function(
      params = HivEstInfTime::GetMigrantParams()
    ) {
      if (!is.null(private$AppMgr) && !is.element(
        private$AppMgr$Steps['CASE_BASED_ORIGIN_GROUPING'],
        private$AppMgr$CompletedSteps
      )) {
        PrintAlert(
          'Origing grouping must be applied before running migration',
          type = 'danger'
        )
        return(invisible(self))
      }

      tryCatch({
        PrintAlert('Starting migration task')

        data <- copy(self$Data)

        if (nrow(data) > 0) {
          private$Catalogs$MigrationTask <- Task$new(
            function(data, params, strat, region, randomSeed) {
              if (!requireNamespace('hivPlatform', quietly = TRUE)) {
                suppressMessages(pkgload::load_all())
              }
              options(width = 120)
              .Random.seed <- randomSeed # nolint

              input <- hivPlatform::PrepareMigrantData(data)
              output <- HivEstInfTime::PredictInf(input, params)
              data[output, ProbPre := i.ProbPre, on = .(UniqueId)]

              # Enrich data with extra dimensions from the input preparation step
              data[
                input$Data$Input,
                ':='(
                  Excluded = i.Excluded,
                  KnownPrePost = i.KnownPrePost,
                  DateOfArrival = i.DateOfArrival
                ),
                on = .(UniqueId)
              ]

              # Enrich outputs with extra dimensions for confidence bounds calculation
              output[
                data,
                ':='(
                  Imputation = i.Imputation,
                  YearOfArrival = data.table::year(i.DateOfArrival),
                  YearOfHIVDiagnosis = i.YearOfHIVDiagnosis,
                  MigrantRegionOfOrigin = i.MigrantRegionOfOrigin,
                  Gender = i.Gender,
                  Transmission = i.Transmission,
                  Age = i.Age,
                  GroupedRegionOfOrigin = i.GroupedRegionOfOrigin
                ),
                on = .(UniqueId)
              ]
              output[, ':='(
                Total = 'Total',
                AgeGroup = cut(
                  Age,
                  breaks = c(-Inf, 25, 40, 55, Inf),
                  labels = c('< 25', '25 - 39', '40 - 54', '55+'),
                  right = FALSE
                )
              )]
              output[
                MigrantRegionOfOrigin == 'CARIBBEAN-LATIN AMERICA',
                MigrantRegionOfOrigin := 'OTHER'
              ]

              hivPlatform::PrintH1('Preparing diagnostic statistics and plots')
              outputStats <- hivPlatform::GetMigrantOutputStats(output)
              confBounds <- hivPlatform::GetMigrantConfBounds(output, strat, region)
              outputPlots <- hivPlatform::GetMigrantOutputPlots(output, minPresentRatio = 1)

              result <- list(
                Input = input$Data,
                Output = output,
                Data = data,
                Artifacts = list(
                  InputStats = input$Stats,
                  OutputStats = outputStats,
                  OutputPlots = outputPlots,
                  ConfBounds = confBounds
                )
              )

              hivPlatform::PrintH1('Done')

              return(result)
            },
            args = list(
              data = data,
              params = params,
              strat = private$Catalogs$MigrationPropStrat,
              region = private$Catalogs$MigrationRegion,
              randomSeed = .Random.seed
            ),
            session = private$Session,
            successCallback = function(result) {
              private$Catalogs$MigrationResult <- result[c('Input', 'Output', 'Artifacts')]
              try({
                if (!is.null(private$Catalogs$AdjustedData)) {
                  private$Catalogs$AdjustedData <- copy(result$Data)
                } else {
                  private$Catalogs$PreProcessedData <- copy(result$Data)
                }
              }, silent = TRUE)
              private$InvalidateAfterStep('CASE_BASED_MIGRATION')
              PrintAlert('Migration task finished')
              private$SendMessage(
                'MIGRATION_RUN_FINISHED',
                payload = list(
                  ActionStatus = 'SUCCESS',
                  ActionMessage = 'Migration task finished',
                  InputStats = ConvertObjToJSON(result$Artifacts$InputStats, dataframe = 'rows'),
                  OutputStats = ConvertObjToJSON(result$Artifacts$OutputStats, dataframe = 'rows'),
                  ConfBounds = ConvertObjToJSON(result$Artifacts$ConfBounds, dataframe = 'rows'),
                  OutputPlots = ConvertObjToJSON(result$Artifacts$OutputPlots, dataframe = 'columns') # nolint
                )
              )
            },
            failCallback = function(msg = NULL) {
              if (!is.null(msg)) {
                PrintAlert(msg, type = 'danger')
              }
              PrintAlert('Migration task failed', type = 'danger')
              private$SendMessage(
                'MIGRATION_RUN_FINISHED',
                payload = list(
                  ActionStatus = 'FAIL',
                  ActionMessage = 'Migration task failed'
                )
              )
            }
          )
          private$SendMessage(
            'MIGRATION_RUN_STARTED',
            payload = list(
              ActionStatus = 'SUCCESS',
              ActionMessage = 'Migration task started'
            )
          )
        }
      },
      error = function(e) {
        private$SendMessage(
          'MIGRATION_RUN_STARTED',
          payload = list(
            ActionStatus = 'FAIL',
            ActionMessage = 'Migration task failed'
          )
        )
        print(e)
      })

      return(invisible(self))
    },

    # 8. Cancel migration --------------------------------------------------------------------------
    CancelMigration = function() {
      if (!is.null(private$Catalogs$MigrationTask)) {
        private$Catalogs$MigrationTask$Stop()

        private$SendMessage(
          'MIGRATION_RUN_CANCELLED',
          payload = list(
            ActionStatus = 'SUCCESS',
            ActionMessage = 'Running migration task cancelled'
          )
        )
      }

      return(invisible(self))
    },

    SetMigrationRegion = function(region) {
      private$Catalogs$MigrationRegion <- region

      if (!is.null(private$Catalogs$MigrationResult$Output)) {
        confBounds <- GetMigrantConfBounds(
          data = private$Catalogs$MigrationResult$Output,
          strat = private$Catalogs$MigrationPropStrat,
          region = private$Catalogs$MigrationRegion
        )
        private$SendMessage(
          'MIGRATION_CONF_BOUNDS_COMPUTED',
          payload = list(
            ActionStatus = 'SUCCESS',
            ConfBounds = ConvertObjToJSON(confBounds, dataframe = 'rows')
          )
        )
      }
    },

    SetMigrationPropStrat = function(strat) {
      if (is.null(strat)) {
        strat <- 'Total'
      }
      private$Catalogs$MigrationPropStrat <- strat

      if (!is.null(private$Catalogs$MigrationResult$Output)) {
        confBounds <- GetMigrantConfBounds(
          data = private$Catalogs$MigrationResult$Output,
          strat = private$Catalogs$MigrationPropStrat,
          region = private$Catalogs$MigrationRegion
        )
        private$SendMessage(
          'MIGRATION_CONF_BOUNDS_COMPUTED',
          payload = list(
            ActionStatus = 'SUCCESS',
            ConfBounds = ConvertObjToJSON(confBounds, dataframe = 'rows')
          )
        )
      }
    },

    GetState = function() {
      state <- list(
        Catalogs = list(
          FilePath = private$Catalogs$FilePath,
          FileName = private$Catalogs$FileName,
          OriginalData = private$Catalogs$OriginalData,
          AttrMapping = private$Catalogs$AttrMapping,
          AttrMappingStatus = private$Catalogs$AttrMappingStatus,
          OriginDistribution = private$Catalogs$OriginDistribution,
          OriginGrouping = private$Catalogs$OriginGrouping,
          PreProcessArtifacts = private$Catalogs$PreProcessArtifacts,
          Filters = private$Catalogs$Filters,
          PreProcessedData = isolate(private$Catalogs$PreProcessedData),
          PreProcessedDataStatus = private$Catalogs$PreProcessedDataStatus,
          AdjustedData = isolate(private$Catalogs$AdjustedData),
          AdjustmentResult = private$Catalogs$AdjustmentResult,
          MigrationRegion = private$Catalogs$MigrationRegion,
          MigrationPropStrat = private$Catalogs$MigrationPropStrat,
          MigrationResult = private$Catalogs$MigrationResult
        )
      )

      return(state)
    },

    SetState = function(state) {
      private$DestroyObservers()
      private$Catalogs$FilePath <- state$Catalogs$FilePath
      private$Catalogs$FileName <- state$Catalogs$FileName
      private$Catalogs$OriginalData <- state$Catalogs$OriginalData
      private$Catalogs$AttrMapping <- state$Catalogs$AttrMapping
      private$Catalogs$AttrMappingStatus <- state$Catalogs$AttrMappingStatus
      private$Catalogs$OriginDistribution <- state$Catalogs$OriginDistribution
      private$Catalogs$OriginGrouping <- state$Catalogs$OriginGrouping
      private$Catalogs$PreProcessArtifacts <- state$Catalogs$PreProcessArtifacts
      private$Catalogs$Filters <- state$Catalogs$Filters
      private$Catalogs$PreProcessedData <- isolate(state$Catalogs$PreProcessedData)
      private$Catalogs$PreProcessedDataStatus <- state$Catalogs$PreProcessedDataStatus
      private$Catalogs$AdjustedData <- isolate(state$Catalogs$AdjustedData)
      private$Catalogs$AdjustmentResult <- state$Catalogs$AdjustmentResult
      private$Catalogs$MigrationRegion <- state$Catalogs$MigrationRegion
      private$Catalogs$MigrationPropStrat <- state$Catalogs$MigrationPropStrat
      private$Catalogs$MigrationResult <- state$Catalogs$MigrationResult
      private$CreateObservers()
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

    # Observers
    Observers = NULL,

    SendMessage = function(...) {
      if (is.function(private$AppMgr$SendMessage)) {
        private$AppMgr$SendMessage(...)
      }
    },

    InvalidateAfterStep = function(step) {
      if (
        step %in% c('CASE_BASED_READ')
      ) {
        private$Catalogs$OriginDistribution <- NULL
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$PreProcessArtifacts <- NULL
        private$Catalogs$PreProcessedData <- NULL
        private$Catalogs$PreProcessedDataStatus <- NULL
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
        private$Catalogs$MigrationTask <- NULL
        private$Catalogs$MigrationResult <- NULL
      }

      if (
        step %in% c('CASE_BASED_ATTR_MAPPING')
      ) {
        if ('GroupedRegionOfOrigin' %in% colnames(private$Catalogs$PreProcessedData)) {
          private$Catalogs$PreProcessedData[, GroupedRegionOfOrigin := NULL]
        }
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
        private$Catalogs$MigrationTask <- NULL
        private$Catalogs$MigrationResult <- NULL
      }

      if (
        step %in% c('CASE_BASED_ORIGIN_GROUPING')
      ) {
        private$Catalogs$AdjustedData <- NULL
        private$Catalogs$AdjustmentTask <- NULL
        private$Catalogs$AdjustmentResult <- NULL
        private$Catalogs$MigrationTask <- NULL
        private$Catalogs$MigrationResult <- NULL
      }

      if (!is.null(private$AppMgr)) {
        private$AppMgr$SetCompletedStep(step)
      }

      return(invisible(self))
    },

    DestroyObservers = function() {
      sapply(private$Observers, function(o) o$destroy())
      private$Observers <- list()
      PrintAlert('CaseDataManager observers destroyed')
    },

    CreateObservers = function() {
      private$Observers[[length(private$Observers) + 1]] <- observeEvent(self$Data, {
        PrintAlert('Change in appMgr$CaseMgr$Data detected')
        result <- GetAvailableStrata(self$Data)
        variables <- lapply(names(result$Variables), function(varName) {
          list(
            Name = varName,
            Code = unname(result$Variables[[varName]])
          )
        })

        private$SendMessage(
          'AVAILABLE_STRATA_SET',
          payload = list(
            ActionStatus = 'SUCCESS',
            AvailableVariables = variables,
            AvailableStrata = jsonlite::toJSON(result$Strata)
          )
        )
      }, ignoreInit = TRUE)

      return(invisible(self))
    }
  ),

  active = list(
    FilePath = function() {
      return(private$Catalogs$FilePath)
    },

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

    Filters = function() {
      return(private$Catalogs$Filters)
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
      if (
        is.list(private$Catalogs$AdjustmentResult) &&
        length(private$Catalogs$AdjustmentResult) > 0
      ) {
        result <- private$Catalogs$AdjustmentResult[[length(private$Catalogs$AdjustmentResult)]]
      } else {
        result <- NULL
      }

      return(result)
    },

    AdjustmentsReport = function() {
      report <- ''
      for (i in seq_along(private$Catalogs$AdjustmentResult)) {
        report <- paste(report, private$Catalogs$AdjustmentResult[[i]]$Report)
      }
      return(report)
    },

    MigrationTask = function() {
      return(private$Catalogs$MigrationTask)
    },

    MigrationResult = function() {
      return(private$Catalogs$MigrationResult)
    },

    Data = function() {
      if (!is.null(private$Catalogs$AdjustedData)) {
        data <- private$Catalogs$AdjustedData
      } else {
        data <- private$Catalogs$PreProcessedData
      }
      return(data)
    }
  )
)
