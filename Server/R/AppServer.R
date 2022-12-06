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
  Events(input, output, session, appMgr)

  if (getOption('hivPlatform.stopOnSessionEnded', FALSE)) {
    session$onSessionEnded(stopApp)
  }

  return(invisible(NULL))
}
