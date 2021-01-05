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

      private$CaseMgrPriv <- CaseDataManager$new(session, self)
      private$AggrMgrPriv <- AggrDataManager$new(session, self)
      private$HIVModelMgrPriv <- HIVModelDataManager$new(session, self)

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Report = NULL,
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

    # HIV Model manager
    HIVModelMgrPriv = NULL,

    # Storage
    Catalogs = NULL
  ),

  active = list(
    CaseMgr = function() {
      return(private$CaseMgrPriv)
    },

    AggrMgr = function() {
      return(private$AggrMgrPriv)
    },

    HIVModelMgr = function() {
      return(private$HIVModelMgrPriv)
    }

    # HIVModelParameters = function(xmlModel) {
    #   if (missing(xmlModel)) {
    #     return(private$Catalogs$HIVModelParameters)
    #   } else {
    #     private$Catalogs$HIVModelParameters <- ParseXMLModel(xmlModel)
    #   }
    # },

    # FlatHIVBootstrapModelResults = function() {
    #   return(Reduce(c, private$Catalogs$HIVBootstrapModelResults))
    # },

    # HIVBootstrapStatistics = function() {
    #   return(private$Catalogs$HIVBootstrapStatistics)
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
