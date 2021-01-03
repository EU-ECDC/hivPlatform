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
        LastStep = 0L,

        HIVModelTask = NULL,
        HIVModelResults = NULL
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
      if (step == 'CombineData') {
        private$Catalogs$Data <- NULL
        private$Catalogs$PopCombination <- NULL
        private$Catalogs$AggrDataSelection <- NULL
        private$Catalogs$LastStep <- 0L
        private$Catalogs$HIVModelTask <- NULL
        private$Catalogs$HIVModelResults <- NULL
      }
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
    }
  )
)
