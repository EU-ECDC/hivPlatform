#' AppServer
#'
#' Application server logic
#'
#' @param input Input
#' @param output Output
#' @param session Session
#'
#' @return NULL (invisibly)
#'
#' @export
AppServer <- function(
  input,
  output,
  session
) {
  appMgr <- AppManager$new(session)

  # Respond to events
  observers <- Events(input, output, session, appMgr)
  appMgr$SetObservers(observers)

  if (getOption('hivPlatform.stopOnSessionEnded', FALSE)) {
    session$onSessionEnded(stopApp)
  }

  return(invisible(NULL))
}
