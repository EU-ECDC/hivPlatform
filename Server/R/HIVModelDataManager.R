#' HIVModelDataManager
#'
#' R6 class for representing the HIV Model manaager
#'
#' @name HIVModelDataManager
#' @examples
#' hivModelMgr <- HIVModelDataManager$new()
NULL

#' @export
HIVModelDataManager <- R6::R6Class(
  classname = 'HIVModelDataManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL,
      appMgr = NULL
    ) {
      private$Session <- session
      private$AppMgr <- appMgr
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Data = NULL,
        PopCombination = NULL,
        AggrDataSelection = NULL,
        MainFitTask = NULL,
        MainFitResult = NULL,
        BootstrapFitTask = NULL,
        BootstrapFitResult = NULL,
        LastStep = 0L
      )
    },

    print = function() {
      print(self$Session)
    },

    # USER ACTIONS =================================================================================

    # 1. Combine data ------------------------------------------------------------------------------
    CombineData = function(
      popCombination = NULL,
      aggrDataSelection = NULL,
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 0) {
        PrintAlert(
          'HIVModelDataManager is not initialized properly before combining data',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      tryCatch({
        caseData <- private$AppMgr$CaseMgr$Data
        aggrData <- private$AppMgr$AggrMgr$Data
        data <- CombineData(caseData, aggrData, popCombination, aggrDataSelection)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Reinitialize('CombineData')
        private$Catalogs$Data <- data
        private$Catalogs$PopCombination <- popCombination
        private$Catalogs$AggrDataSelection <- aggrDataSelection
        private$Catalogs$LastStep <- 1L
        PrintAlert('Data has been combined')
      } else {
        PrintAlert('Combining data failed', type = 'danger')
      }

      payload <- list(
        type = 'HIVModelDataManager:CombineData',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    RunMainFit = function(
      settings = list(),
      parameters = list(),
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 1) {
        PrintAlert('Data must be combined before running adjustments', type = 'danger')
        return(invisible(self))
      }

      dataSets <- private$Catalogs$Data

      PrintAlert('Starting HIV Model main fit task')
      status <- 'SUCCESS'
      private$Reinitialize('RunMainFit')
      tryCatch({
        private$Catalogs$MainFitTask <- Task$new(
          function(dataSets, settings, parameters) {
            options(width = 100)

            result <- list()
            for (i in seq_along(dataSets)) {
              context <- hivModelling::GetRunContext(
                data = dataSets[[i]],
                settings = settings,
                parameters = parameters
              )
              data <- hivModelling::GetPopulationData(context)

              startTime <- Sys.time()
              fitResults <- hivModelling::PerformMainFit(context, data, attemptSimplify = TRUE)
              runTime <- Sys.time() - startTime

              result[[i]] <- list(
                Context = context,
                Data = data,
                Results = fitResults,
                RunTime = runTime
              )
            }
            return(result)
          },
          args = list(
            dataSets = dataSets,
            settings = settings,
            parameters = parameters
          ),
          session = private$Session,
          successCallback = function(result) {
            private$Catalogs$MainFitResult <- result
            private$Catalogs$LastStep <- 2L
            PrintAlert('Running HIV Model main fit task finished')
          },
          failCallback = function() {
            PrintAlert('Running HIV Model main fit task failed', type = 'danger')
          }
        )
      },
      error = function(e) {
        status <- 'FAIL'
        print(e)
      })

      payload <- list(
        type = 'HIVModelDataManager:RunMainFit',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    CancelMainFit = function() {
      private$Catalogs$MainFitTask$Stop()
      return(invisible(self))
    },

    RunBootstrapFit = function(
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 2) {
        PrintAlert('Main fit must be performed before running bootstrap', type = 'danger')
        return(invisible(self))
      }

      dataSets <- private$Catalogs$Data

      PrintAlert('Starting HIV Model bootstrap fit task')
      status <- 'SUCCESS'
      private$Reinitialize('RunBootstrapFit')
      tryCatch({
        private$Catalogs$BootstrapFitTask <- Task$new(
          function() {
            options(width = 100)
            result <- list()
            return(result)
          },
          args = list(),
          session = private$Session,
          successCallback = function(result) {
            private$Catalogs$BootstrapFitResult <- result
            private$Catalogs$LastStep <- 3L
            PrintAlert('Running HIV Model bootstrap fit task finished')
          },
          failCallback = function() {
            PrintAlert('Running HIV Model bootstrap fit task failed', type = 'danger')
          }
        )
      },
      error = function(e) {
        status <- 'FAIL'
        print(e)
      })

      payload <- list(
        type = 'HIVModelDataManager:RunBootstrapFit',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    CancelBootstrapFit = function() {
      private$Catalogs$BootstrapFitTask$Stop()
      return(invisible(self))
    }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Private application manager
    AppMgr = NULL,

    # Storage
    Catalogs = NULL,

    Reinitialize = function(step) {
      if (step %in% 'CombineData') {
        private$Catalogs$Data <- NULL
        private$Catalogs$PopCombination <- NULL
        private$Catalogs$AggrDataSelection <- NULL
      }

      if (step %in% c('CombineData', 'RunMainFit')) {
        private$Catalogs$MainFitTask <- NULL
        private$Catalogs$MainFitResult <- NULL
      }

      if (step %in% c('CombineData', 'RunMainFit', 'RunBootstrapFit')) {
        private$Catalogs$BootstrapFitTask <- NULL
        private$Catalogs$BootstrapFitResult <- NULL
      }

      lastStep <- switch(
        step,
        'CombineData' = 0L,
        'RunMainFit' = 1L,
        'RunBootstrapFit' = 2L
      )
      private$Catalogs$LastStep <- lastStep
    }
  ),

  active = list(
    Data = function() {
      return(private$Catalogs$Data)
    },

    LastStep = function() {
      return(private$Catalogs$LastStep)
    },

    PopCombination = function() {
      return(private$Catalogs$PopCombination)
    },

    AggrDataSelection = function() {
      return(private$Catalogs$AggrDataSelection)
    },

    MainFitTask = function() {
      return(private$Catalogs$MainFitTask)
    },

    MainFitResult = function() {
      return(private$Catalogs$MainFitResult)
    },

    BootstrapFitTask = function() {
      return(private$Catalogs$BootstrapFitTask)
    },

    BootstrapFitResult = function() {
      return(private$Catalogs$BootstrapFitResult)
    }
  )
)
