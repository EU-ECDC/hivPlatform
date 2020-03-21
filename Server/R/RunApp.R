#' RunApp
#'
#' Run the application.
#'
#' @param launchBrowser Logical indicating to open the app in a newly open web browser
#'
#' @return NULL (invisibly)
#'
#' @examples
#' \dontrun{
#' RunApp()
#' }
#'
#' @export
RunApp <- function(launchBrowser = FALSE)
{
  options(shiny.maxRequestSize = 150 * 1024^2)
  app <- shiny::shinyApp(AppUI, AppServer)
  shiny::runApp(app, port = 3306, display.mode = 'normal', test.mode = FALSE)
  return(invisible(NULL))
}
