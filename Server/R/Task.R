#' Task
#'
#' R6 class for representing a background task
#'
#' @name AppManager
#' @examples
#' \dontrun{
#' tast <- Task$new()
#' }
NULL

#' @export
Task <- R6::R6Class(
  classname = 'Task',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      expr,
      args = list(),
      session = NULL
    ) {

      private$Session <- session
      private$Expr <- expr
      private$Args <- args

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)

      private$Catalogs <- catalogStorage(
        TaskHandle = NULL,
        Process = NULL,
        Result = NULL,
        RunLog = '',
        StartTime = NULL,
        Status = 'STANDBY'
      )
    },

    Run = function() {
      private$InitializeCatalogs()

      taskHandle <- callr::r_bg(
        force(private$Expr),
        args = private$Args,
        supervise = TRUE,
        stderr = '2>&1'
      )

      private$Catalogs$Status <- 'CREATED'

      private$Catalogs$TaskHandle <- taskHandle
      private$Catalogs$Process <- taskHandle$as_ps_handle()
      private$Catalogs$StartTime <- taskHandle$get_start_time()

      private$Monitor()
    },

    Stop = function() {
      if (self$IsRunning) {
        private$Catalogs$TaskHandle$kill()
      }
    }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Storage
    Catalogs = NULL,

    # Expression to run
    Expr = NULL,

    # Arguments for the expression
    Args = NULL,

    CancellProcessed = FALSE,

    InitializeCatalogs = function(skipRunLog = FALSE) {
      private$Catalogs$Status <- 'STANDBY'
      private$Catalogs$TaskHandle <- NULL
      private$Catalogs$Process <- NULL
      private$Catalogs$Result <- NULL
      private$Catalogs$StartTime <- NULL
      if (!skipRunLog) {
        private$Catalogs$RunLog <- ''
        private$CancellProcessed <- FALSE
      }
    },

    CollectRunLog = function() {
      log <- ''
      if (self$IsRunning) {
        log <- private$Catalogs$TaskHandle$read_output()
      } else if (self$IsFinished) {
        if (!self$IsCancelled) {
          log <- private$Catalogs$TaskHandle$read_all_output()
        } else if (!private$CancellProcessed) {
          log <- '\nTask cancelled'
          private$CancellProcessed <- TRUE
        }
      }
      return(log)
    },

    AddToRunLog = function(log) {
      private$Catalogs$RunLog <- paste0(
        private$Catalogs$RunLog,
        CollapseTexts(log, collapse = '\n')
      )
    },

    IsReactive = function() {
      return(!is.null(private$Session))
    },

    Monitor = function() {
      if (private$IsReactive()) {
        o <- shiny::observe({
          self$Status
          if (self$IsRunning) {
            private$Catalogs$Status <- 'RUNNING'
            self$RunLog
            shiny::invalidateLater(1000)
          } else {
            private$Catalogs$Status <- 'STOPPED'
            self$Result
            self$RunLog
            o$destroy()
          }
        })
      } else {
        while (self$IsRunning) {
          private$Catalogs$Status <- 'RUNNING'
          log <- private$CollectRunLog()
          cat(log)
          private$AddToRunLog(log)
          Sys.sleep(1)
        }
        private$Catalogs$Status <- 'STOPPED'
        log <- private$CollectRunLog()
        cat(log)
        private$AddToRunLog(log)
      }
    }
  ),

  active = list(
    Result = function() {
      if (self$IsFinished && !self$IsCancelled) {
        result <- try(
          private$Catalogs$TaskHandle$get_result(),
          silent = TRUE
        )
        if (inherits(result, 'try-error')) {
          result <- NULL
        }
        private$Catalogs$Result <- result
      }
      return(private$Catalogs$Result)
    },

    RunLog = function() {
      private$AddToRunLog(private$CollectRunLog())

      return(private$Catalogs$RunLog)
    },

    HTMLRunLog = function() {
      return(fansi::sgr_to_html(private$Catalogs$RunLog, warn = FALSE))
    },

    TaskHandle = function() {
      return(private$Catalogs$TaskHandle)
    },

    Process = function() {
      return(private$Catalogs$Process)
    },

    StartTime = function() {
      return(private$Catalogs$StartTime)
    },

    IsInitialized = function() {
      return(!is.null(private$Catalogs$Process))
    },

    IsRunning = function() {
      return(
        self$IsInitialized &&
          ps::ps_is_running(private$Catalogs$Process)
      )
    },

    IsFinished = function() {
      return(
        self$IsInitialized &&
          !self$IsRunning &&
          !is.null(private$Catalogs$TaskHandle$get_exit_status())
      )
    },

    IsCancelled = function() {
      return(
        self$IsFinished &&
          (
            is.na(private$Catalogs$TaskHandle$get_exit_status()) ||
            private$Catalogs$TaskHandle$get_exit_status() %in% c(2, -9)
          )
      )
    },

    Status = function() {
      return(private$Catalogs$Status)
    }
  )
)
