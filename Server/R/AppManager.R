#' AppManager
#'
#' R6 class for representing the app manaager
#'
#' @name AppManager
#' @examples
#' pppManager <- AppManager$new()
NULL

#' @export
AppManager <- R6::R6Class(
  classname = 'AppManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL
    ) {
      PrintAlert('Temporary directory: {.val {tempdir()}}')

      private$Session <- session

      private$CaseMgrPriv <- CaseDataManager$new(session)
      private$AggrMgrPriv <- AggrDataManager$new(session)

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        MICount = 0,
        BSCount = 0,
        AggregatedDataSelection = NULL,
        PopulationCombination = list(CaseBasedPopulations = c(), AggrPopulations = c()),
        HIVModelParameters = NULL,
        HIVModelResults = NULL,
        HIVBootstrapModelResults = NULL,
        Report = NULL,
        AdjustmentTask = NULL,
        HIVModelTask = NULL,
        BootstrapTask = NULL,
        ReportTask = NULL
      )
    },

    print = function() {
      print(self$Session)
    },

    SendEventToReact = function(eventName, value) {
      if (!is.null(private$Session)) {
        private$Session$sendCustomMessage(eventName, value)
      }
    }

    # # USER ACTIONS =================================================================================

    # # 9. Fit HIV model -----------------------------------------------------------------------------
    # FitHIVModel = function(
    #   settings = list(),
    #   parameters = list(),
    #   popCombination = NULL,
    #   aggrDataSelection = NULL
    # ) {
    #   dataSets <- CombineData(
    #     copy(self$FinalAdjustedCaseBasedData$Table),
    #     copy(private$Catalogs$AggregatedData),
    #     private$Catalogs$PopulationCombination,
    #     private$Catalogs$AggregatedDataSelection
    #   )

    #   private$Catalogs$HIVModelTask <- Task$new(
    #     function(dataSets, settings, parameters) {
    #       options(width = 100)

    #       results <- list()
    #       for (i in seq_along(dataSets)) {
    #         context <- hivModelling::GetRunContext(
    #           data = dataSets[[i]],
    #           settings = settings,
    #           parameters = parameters
    #         )
    #         data <- hivModelling::GetPopulationData(context)

    #         startTime <- Sys.time()
    #         fitResults <- hivModelling::PerformMainFit(context, data, attemptSimplify = TRUE)
    #         runTime <- Sys.time() - startTime

    #         results[[i]] <- list(
    #           Context = context,
    #           Data = data,
    #           Results = fitResults,
    #           RunTime = runTime
    #         )
    #       }
    #       return(results)
    #     },
    #     args = list(
    #       dataSets = dataSets,
    #       settings = settings,
    #       parameters = parameters
    #     ),
    #     session = private$Session
    #   )
    #   private$Catalogs$HIVModelTask$Run()

    #   return(invisible(self))
    # },

    # CancelHIVModelFit = function() {
    #   private$Catalogs$HIVModelTask$Stop()

    #   return(invisible(self))
    # },

    # # 10. Perform non-parametric bootstrap ---------------------------------------------------------
    # RunBootstrap = function(
    #   bsCount = NULL,
    #   maxRunTimeFactor = 3,
    #   type = 'NON-PARAMETRIC',
    #   verbose = FALSE
    # ) {
    #   if (is.null(bsCount)) {
    #     bsCount <- private$Catalogs$BSCount
    #   } else {
    #     private$Catalogs$BSCount <- bsCount
    #   }

    #   avgRunTime <- mean(sapply(private$Catalogs$HIVModelResults, '[[', 'RunTime'))
    #   maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')

    #   PrintAlert('Maximum allowed run time: {.timestamp {prettyunits::pretty_dt(maxRunTime)}}')

    #   private$Catalogs$BootstrapTask <- Task$new(
    #     function(
    #       bsCount,
    #       maxRunTime,
    #       hivModelResultsList,
    #       finalAdjustedCaseBasedData,
    #       aggregatedData,
    #       populationCombination,
    #       aggregatedDataSelection,
    #       verbose
    #     ) {
    #       suppressMessages(pkgload::load_all())
    #       options(width = 100)
    #       miCount <- length(hivModelResultsList)
    #       results <- list()
    #       for (i in seq_len(miCount)) {

    #         bootResults <- list()
    #         PrintH2('Data set {.val {i}}')

    #         hivModelResults <- hivModelResultsList[[i]]

    #         context <- hivModelResults$Context
    #         param <- hivModelResults$Results$Param
    #         info <- hivModelResults$Results$Info

    #         context$Settings <- modifyList(
    #           context$Settings,
    #           list(
    #             ModelFilePath = NULL,
    #             InputDataPath = NULL,
    #             Verbose = verbose
    #           ),
    #           keep.null = TRUE
    #         )

    #         mainCaseBasedDataSet <- finalAdjustedCaseBasedData$Table[Imputation == (i - 1)]

    #         jSucc <- 1
    #         j <- 0
    #         while (jSucc <= bsCount) {
    #           j <- j + 1

    #           # Bootstrap data set
    #           indices <- sample.int(nrow(mainCaseBasedDataSet), replace = TRUE)
    #           bootCaseBasedDataSet <- mainCaseBasedDataSet[indices]
    #           bootAggregatedData <- CombineData(
    #             copy(bootCaseBasedDataSet),
    #             copy(aggregatedData),
    #             populationCombination,
    #             aggregatedDataSelection
    #           )[[1]]

    #           bootContext <- hivModelling::GetRunContext(
    #             data = bootAggregatedData,
    #             parameters = context$Parameters,
    #             settings = context$Settings
    #           )

    #           bootData <- hivModelling::GetPopulationData(bootContext)

    #           startTime <- Sys.time()
    #           bootResult <- hivModelling::PerformMainFit(
    #             bootContext, bootData,
    #             param = param, info = info, attemptSimplify = FALSE,
    #             maxRunTime = maxRunTime
    #           )
    #           runTime <- Sys.time() - startTime

    #           msgType <- ifelse(bootResult$Converged, 'success', 'danger')

    #           PrintAlert(
    #             'Fit to data set {.val {jSucc}} done |',
    #             'Run time: {.timestamp {prettyunits::pretty_dt(runTime)}}',
    #             type = msgType
    #           )

    #           bootResults[[j]] <- list(
    #             Context = bootContext,
    #             Data = bootData,
    #             Results = bootResult,
    #             RunTime = runTime
    #           )

    #           if (bootResult$Converged) {
    #               jSucc <- jSucc + 1
    #           }

    #           progress <- (jSucc + (i - 1) * bsCount) / (miCount * bsCount) * 100
    #         }

    #         results[[i]] <- bootResults
    #       }
    #       return(results)
    #     },
    #     args = list(
    #       bsCount = bsCount,
    #       maxRunTime = maxRunTime,
    #       hivModelResultsList = private$Catalogs$HIVModelResults,
    #       finalAdjustedCaseBasedData = self$FinalAdjustedCaseBasedData,
    #       aggregatedData = private$Catalogs$AggregatedData,
    #       populationCombination = private$Catalogs$PopulationCombination,
    #       aggregatedDataSelection = private$Catalogs$AggregatedDataSelection,
    #       verbose = verbose
    #     ),
    #     session = private$Session
    #   )
    #   private$Catalogs$BootstrapTask$Run()

    #   return(invisible(self))
    # },

    # CancelBootstrapTask = function() {
    #   private$Catalogs$BootstrapTask$Stop()

    #   return(invisible(self))
    # },

    # ComputeHIVBootstrapStatistics = function() {
    #   flatList <- self$FlatHIVBootstrapModelResults

    #   resultsList <- lapply(flatList, '[[', 'Results')

    #   runTime <- sapply(resultsList, '[[', 'RunTime')

    #   converged <- sapply(resultsList, '[[', 'Converged')

    #   succFlatList <- Filter(function(item) item$Results$Converged, flatList)

    #   succResultsList <- lapply(succFlatList, '[[', 'Results')

    #   info <- lapply(succResultsList, '[[', 'Info')[[1]]
    #   years <- info$ModelMinYear:(info$ModelMaxYear - 1)

    #   mainOutputList <- lapply(succResultsList, '[[', 'MainOutputs')
    #   colNames <- colnames(mainOutputList[[1]])
    #   mainOutputStats <- setNames(lapply(colNames, function(colName) {
    #     resultSample <- sapply(mainOutputList, '[[', colName)
    #     result <- cbind(
    #       t(apply(resultSample, 1, quantile, c(0.025, 0.5, 0.975))),
    #       Mean = apply(resultSample, 1, mean),
    #       Std = apply(resultSample, 1, sd)
    #     )
    #     rownames(result) <- years
    #     return(result)
    #   }), colNames)

    #   succParamList <- lapply(succResultsList, '[[', 'Param')
    #   betas <- as.data.table(t(sapply(succParamList, '[[', 'Beta')))
    #   setnames(betas, sprintf('Beta%d', seq_len(ncol(betas))))
    #   bootBetasStats <- lapply(betas, function(col) {
    #     c(
    #       quantile(col, probs = c(0.025, 0.5, 0.975)),
    #       Mean = mean(col),
    #       Std = sd(col)
    #     )
    #   })

    #   thetas <- as.data.table(t(sapply(succParamList, '[[', 'Theta')))
    #   setnames(thetas, sprintf('Theta%d', seq_len(ncol(thetas))))
    #   bootThetasStats <- lapply(thetas, function(col) {
    #     c(
    #       quantile(col, probs = c(0.025, 0.5, 0.975)),
    #       Mean = mean(col),
    #       Std = sd(col)
    #     )
    #   })

    #   private$Catalogs$HIVBootstrapStatistics <- list(
    #     RunTime = runTime,
    #     Converged = converged,
    #     Beta = betas,
    #     Theta = thetas,
    #     MainOutputsStats = mainOutputStats,
    #     BetaStats = bootBetasStats,
    #     ThetaStats = bootThetasStats
    #   )

    #   return(invisible(self))
    # },

    # CreateReport = function(reportName) {
    #   reportFilePath <- GetReportFileNames()[reportName]
    #   params <- list(
    #     AdjustedData = private$Catalogs$AdjustedCaseBasedData,
    #     ReportingDelay = TRUE,
    #     Smoothing = TRUE,
    #     CD4ConfInt = FALSE
    #   )

    #   if (is.element(reportName, c('Main Report'))) {
    #     params <- GetMainReportArtifacts(params)
    #   }

    #   params <- modifyList(
    #     params,
    #     list(
    #       Artifacts = list(
    #         FileName = private$Catalogs$CaseBasedDataPath,
    #         DiagYearRange = NULL,
    #         NotifQuarterRange = NULL,
    #         DiagYearRangeApply = TRUE
    #       )
    #     )
    #   )

    #   htmlReportFileName <- RenderReportToFile(
    #     reportFilePath = reportFilePath,
    #     format = 'html_document',
    #     params = params,
    #     outDir = dirname(private$Catalogs$CaseBasedDataPath)
    #   )

    #   return(htmlReportFileName)
    # },

    # SetMICount = function(count) {
    #   private$Catalogs$MICount <- max(count, 0)
    # },

    # SetBSCount = function(count) {
    #   private$Catalogs$BSCount <- max(count, 0)
    # },

    # SetPopulationCombination = function(populationCombination) {
    #   private$Catalogs$PopulationCombination <- PopulationCombination
    # },

    # SetAggregatedDataSelection = function(aggregatedDataSelection) {
    #   private$Catalogs$AggregatedDataSelection <- aggregatedDataSelection
    # },

    # GenerateReport = function() {
    #   private$Catalogs$ReportTask <- Task$new(
    #     function() {
    #       results <- "<h1>Title</h1><p>Text set in R</p>"
    #       return(results)
    #     },
    #     args = list(),
    #     session = private$Session
    #   )
    #   private$Catalogs$ReportTask$Run()

    #   return(invisible(self))
    # },

    # CancelReportTask = function() {
    #   private$Catalogs$ReportTask$Stop()

    #   return(invisible(self))
    # }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Case-based data manager
    CaseMgrPriv = NULL,

    # Aggregated data manager
    AggrMgrPriv = NULL,

    # Storage
    Catalogs = NULL,

    PrepareBootstrapAggregatedData = function(strata = NULL) {
      bootCaseBasedDataSets <- private$Catalogs$BootstrapCaseBasedDataSets
      bootAggregatedDataSets <- lapply(
        bootCaseBasedDataSets,
        function(bootCaseBasedDataSet) {
          lapply(bootCaseBasedDataSet, PrepareDataSetsForModel, strata = strata)
        }
      )

      private$Catalogs$BootstrapAggregatedDataSets <- bootAggregatedDataSets
    }
  ),

  active = list(
    CaseMgr = function() {
      return(private$CaseMgrPriv)
    },

    AggrMgr = function() {
      return(private$AggrMgrPriv)
    }

    # MICount = function() {
    #   return(private$Catalogs$MICount)
    # },

    # BSCount = function() {
    #   return(private$Catalogs$BSCount)
    # },

    # AggregatedDataSelection = function() {
    #   return(private$Catalogs$AggregatedDataSelection)
    # },

    # PopulationCombination = function() {
    #   return(private$Catalogs$PopulationCombination)
    # },

    # BootstrapCaseBasedDataSets = function() {
    #   return(private$Catalogs$BootstrapCaseBasedDataSets)
    # },

    # BootstrapAggregatedDataSets = function() {
    #   return(private$Catalogs$BootstrapAggregatedDataSets)
    # },

    # HIVModelResults = function(dt) {
    #   if (missing(dt)) {
    #     return(private$Catalogs$HIVModelResults)
    #   } else {
    #     private$Catalogs$HIVModelResults <- dt
    #   }
    # },

    # HIVModelParameters = function(xmlModel) {
    #   if (missing(xmlModel)) {
    #     return(private$Catalogs$HIVModelParameters)
    #   } else {
    #     private$Catalogs$HIVModelParameters <- ParseXMLModel(xmlModel)
    #   }
    # },

    # HIVBootstrapModelResults = function(dt) {
    #   if (missing(dt)) {
    #     return(private$Catalogs$HIVBootstrapModelResults)
    #   } else {
    #     if (!is.null(dt)) {
    #       private$Catalogs$HIVBootstrapModelResults <- dt
    #     }
    #   }
    # },

    # FlatHIVBootstrapModelResults = function() {
    #   return(Reduce(c, private$Catalogs$HIVBootstrapModelResults))
    # },

    # HIVBootstrapStatistics = function() {
    #   return(private$Catalogs$HIVBootstrapStatistics)
    # },

    # HIVModelTask = function() {
    #   return(private$Catalogs$HIVModelTask)
    # },

    # BootstrapTask = function() {
    #   return(private$Catalogs$BootstrapTask)
    # },

    # ReportTask = function() {
    #   return(private$Catalogs$ReportTask)
    # },

    # Report = function(report) {
    #   if (missing(report)) {
    #     return(private$Catalogs$Report)
    #   } else {
    #     if (!is.null(report)) {
    #       private$Catalogs$Report <- report
    #     }
    #   }
    # }
  )
)
