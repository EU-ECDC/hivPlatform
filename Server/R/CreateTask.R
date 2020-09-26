#' CreateTask
#'
#' Create a long-running task, on Linux executed in a forked process, on Windows in the same
#' session.\cr
#'
#' The return value is a promise-like object with three methods:\cr
#' - completed(): FALSE initially, then TRUE if the task succeeds, fails, or is cancelled. Reactive,
#'   so when the state changes any reactive readers will invalidate.\cr
#' - result(): Use this to get the return value. While execution is in progress, performs a
#'   req(FALSE). If task succeeded, returns the return value. If failed, throws error. Reactive, so
#'   when the state changes any reactive readers will invalidate.\cr
#' - cancel(): Call this to prematurely terminate the task.
#'
#' @param expr Expression to be executed. Required.
#' @param args List object with arguments to be passed to \code{expr}. Optional.
#'   Default = \code{NULL}
#' @param timeout Number of seconds between consecutive checks of the task. Optional.
#'   Default = 1L
#'
#' @return Closure
#'
#' @examples
#' \dontrun{
#' task <- CreateTask(function() {
#'   Sys.sleep(5)
#'   dt <- cars[sample(nrow(cars), 10), ]
#'   print('Message from another world')
#'   return(dt)
#' })
#' shiny::isolate(task$result())
#' }
#'
#' @export
CreateTask <- function(expr, args = list(), timeout = 1L)
{
  state <- 'ready'
  result <- NULL
  runLog <- ''
  startTime <- NULL
  cpuTime <- NULL

  # Launch the task in a forked process. This always returns
  # immediately, and we get back a handle we can use to monitor
  # or kill the job.
  taskHandle <- callr::r_bg(force(expr), args = args)
  startTime <- taskHandle$get_start_time()

  if (taskHandle$is_alive()) {
    state <- 'running'
  }

  return(
    list(
      isRunning = function() {

      },
      cancel = function() {
        if (is.null(taskHandle$get_exit_status())) {
          killSuccess <- taskHandle$kill()
          if (killSuccess && !taskHandle$is_alive()) {
            state <<- 'cancelled'
          }
        }
      },
      state = function() {
        if (taskHandle$is_alive()) {
          state <<- 'running'
        } else {
          state
        }
        return(state)
      },
      result = function() {
        if (!taskHandle$is_alive()) {
          if (taskHandle$get_exit_status() == 0) {
            res <- try({taskHandle$get_result()})
            if (!inherits(res, 'try-error')) {
              state <<- 'success'
              result <<- res
            } else {
              state <<- 'error'
              result <<- NULL
            }
            runLog <<- paste(
              runLog,
              CollapseTexts(taskHandle$read_all_output(), collapse = '\n'),
              sep = ''
            )
            cpuTime <- taskHandle$get_cpu_times()
          }
          # taskHandle$kill()
        }
        return(result)
      },
      runLog = function() {
        if (taskHandle$is_alive()) {
          runLog <<- paste(
            runLog,
            CollapseTexts(taskHandle$read_output(), collapse = '\n'),
            sep = ''
          )
        } else {
          runLog <<- paste(
            runLog,
            CollapseTexts(taskHandle$read_all_output(), collapse = '\n'),
            sep = ''
          )
        }
        return(runLog)
      },
      taskHandle = function() taskHandle,
      completed = function() {
        exitStatus <- taskHandle$get_exit_status()
        if (!is.null(exitStatus)) {
          if (exitStatus == 0) {
            state <<- 'success'
          } else {
            state <<- 'error'
          }
        }
        return(!is.null(exitStatus))
      },
      startTime = function() startTime,
      cpuTime = function() cpuTime
    )
  )
}
