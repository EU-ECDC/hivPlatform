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
      private$HIVModelMgrPriv <- HIVModelManager$new(session, self)

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        CompletedSteps = NULL,
        Report = NULL,
        ReportTask = NULL
      )

      self$SetCompletedStep('SESSION_INITIALIZED')
    },

    print = function() {
      print(self$Session)
    },

    SendMessage = function(type, payload = list()) {
      if (missing(type)) {
        PrintAlert('Arguments {.arg type} must be provided', type = 'danger')
        return(invisible(NULL))
      }

      if (!is.null(private$Session)) {
        private$Session$sendCustomMessage('shinyHandler', list(
          type = type,
          payload = payload
        ))
      }
    },

    Steps = c(
      'SESSION_INITIALIZED' = 1L,
      'CASE_BASED_READ' = 2L,
      'CASE_BASED_ATTR_MAPPING' = 3L,
      'CASE_BASED_ORIGIN_GROUPING' = 4L,
      'CASE_BASED_SUMMARY' = 5L,
      'CASE_BASED_ADJUSTMENTS' = 6L,
      'MODELLING' = 7L,
      'BOOTSTRAP' = 8L,
      'REPORTS' = 9L,
      'OUTPUTS' = 10L
    ),

    SetCompletedStep = function(step) {
      completedSteps <- isolate(private$Catalogs$CompletedSteps)
      step <- self$Steps[step]
      keptSteps <- completedSteps[completedSteps < step]
      newCompletedSteps <- sort(union(keptSteps, step))
      private$Catalogs$CompletedSteps <- self$Steps[newCompletedSteps]

      if (!identical(completedSteps, newCompletedSteps)) {
        self$SendMessage(
          'COMPLETED_STEPS_SET',
          payload = list(
            ActionStatus = 'SUCCESS',
            CompletedSteps = isolate(names(private$Catalogs$CompletedSteps))
          )
        )
      }
    }

    # # USER ACTIONS ===============================================================================

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
    },

    CompletedSteps = function() {
      return(private$Catalogs$CompletedSteps)
    }

    # HIVModelParameters = function(xmlModel) {
    #   if (missing(xmlModel)) {
    #     return(private$Catalogs$HIVModelParameters)
    #   } else {
    #     private$Catalogs$HIVModelParameters <- ParseXMLModel(xmlModel)
    #   }
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
