#' AggrDataManager
#'
#' R6 class for representing the aggregated data manaager
#'
#' @name AggrDataManager
#' @examples
#' caseMgr <- AggrDataManager$new()
NULL

#' @export
AggrDataManager <- R6::R6Class(
  classname = 'AggrDataManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL
    ) {
      private$Session <- session
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        FileName = NULL,
        Data = NULL,
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
          'AggrDataManager is not initialized properly before reading data',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      tryCatch({
        data <- hivModelling::ReadInputData(fileName)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Reinitialize('ReadData')
        private$Catalogs$FileName <- fileName
        private$Catalogs$Data <- data
        private$Catalogs$LastStep <- 1L
        PrintAlert('Data file {.file {fileName}} loaded')
      } else {
        PrintAlert('Loading data file {.file {fileName}} failed', type = 'danger')
      }

      payload <- list(
        type = 'AggrDataManager:ReadData',
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

    # Storage
    Catalogs = NULL,

    Reinitialize = function(step) {
      if (step == 'ReadData') {
        private$Catalogs$FileName <- NULL
        private$Catalogs$Data <- NULL
        private$Catalogs$LastStep <- 0L
      }
    }
  ),

  active = list(
    FileName = function() {
      return(private$Catalogs$FileName)
    },

    Data = function() {
      return(private$Catalogs$Data)
    },

    LastStep = function() {
      return(private$Catalogs$LastStep)
    }
  )
)
