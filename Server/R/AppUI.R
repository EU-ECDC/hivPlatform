#' AppUI
#'
#' Application client logic
#'
#' @return html
#'
#' @export
AppUI <- function() {
  wwwPath <- system.file('app/www', package = 'hivEstimatesAccuracyReloaded')
  shiny::addResourcePath('www', wwwPath)

  shiny::htmlTemplate(file.path(wwwPath, 'index.html'))
}
