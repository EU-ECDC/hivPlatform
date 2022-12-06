#' RunApp
#'
#' Run the application.
#'
#' @param port Port
#' @param launchBrowser launchBrowser
#' @param stopOnSessionEnded stopOnSessionEnded
#'
#' @return NULL (invisibly)
#'
#' @examples
#' \dontrun{
#' RunApp()
#' }
#'
#' @export
RunApp <- function(
  port = NULL,
  launchBrowser = FALSE,
  stopOnSessionEnded = FALSE
) {
  options(shiny.maxRequestSize = 100 * 1024^2)
  options(shiny.trace = FALSE)
  options(hivPlatform.stopOnSessionEnded = stopOnSessionEnded)

  app <- shiny::shinyApp(
    AppUI,
    AppServer,
    options = c(
      display.mode = 'normal',
      test.mode = FALSE,
      launch.browser = launchBrowser
    )
  )
  if (launchBrowser) {
    shiny::runApp(app, port = port)
  }
  return(invisible(app))
}
