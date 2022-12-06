#' RunApp
#'
#' Run the application.
#'
#' @param port Port
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
  port
) {
  options(shiny.maxRequestSize = 100 * 1024^2)
  options(shiny.trace = FALSE)

  app <- shiny::shinyApp(
    AppUI,
    AppServer,
    options = c(
      display.mode = 'normal',
      test.mode = FALSE,
      launch.browser = FALSE
    )
  )
  if (!missing(port)) {
    shiny::runApp(app, port = port)
  }
  return(app)
}
