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
      session = NULL,
      appMgr = NULL
    ) {
      private$Session <- session
      private$AppMgr <- appMgr
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        FileName = NULL,
        Data = NULL,
        LastStep = 0L
      )
    },

    print = function() {
      print('AggrDataManager')
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadData = function(
      fileName,
      callback = private$AppMgr$SendMessage
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

        dataNames <- names(data)
        dataFiles <- lapply(
          dataNames,
          function(dataName) {
            dt <- data[[dataName]]
            list(
              name = dataName,
              use = TRUE,
              years = c(min(dt$Year), max(dt$Year))
            )
          }
        )
        payload <- list(
          DataFiles = dataFiles,
          PopulationNames = names(data[[1]])[-1]
        )
      } else {
        PrintAlert('Loading data file {.file {fileName}} failed', type = 'danger')
        payload <- list()
      }

      if (is.function(callback)) {
        callback(type = 'AGGR_DATA_READ', status = status, payload = payload)
      }

      return(invisible(payload))
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
      if (step %in% 'ReadData') {
        private$Catalogs$FileName <- NULL
        private$Catalogs$Data <- NULL
      }

      lastStep <- switch(
        step,
        'ReadData' = 0L
      )
      private$Catalogs$LastStep <- lastStep
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
