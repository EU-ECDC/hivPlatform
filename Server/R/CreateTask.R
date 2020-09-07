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
#'   cars[sample(nrow(cars), 10),]
#' })
#' shiny::isolate(task$result())
#' }
#'
#' @export
CreateTask <- function(expr, args = NULL, timeout = 1L)
{
  # shiny::makeReactiveBinding('state')
  state <- 'running'
  result <- NULL

  # Launch the task in a forked process. This always returns
  # immediately, and we get back a handle we can use to monitor
  # or kill the job.
  taskHandle <- callr::r_bg(force(expr), args = args)

  # Poll every [timeout] milliseconds until the job completes
  while (taskHandle$is_alive()) {
    if (state == 'cancel') {
      taskHandle$kill()
    }
    cat(CollapseTexts(taskHandle$read_output(), collapse = '\n') )
    Sys.sleep(timeout)
  }
  cat(CollapseTexts(taskHandle$read_all_output(), collapse = '\n') )

  res <- try({taskHandle$get_result()})
  # o$destroy()
  if (!inherits(res, 'try-error')) {
    state <- 'success'
    result <- res
  } else {
    state <- 'error'
    result <- NULL
  }
  taskHandle$kill()

  return(
    list(
      completed = function() {
        state != 'running'
      },
      cancel = function() {
        if (state == 'running') {
          state <- 'cancel'
        }
      },
      state = function() {
        state
      },
      taskHandle = function() {
        taskHandle
      }
    )
  )
}
