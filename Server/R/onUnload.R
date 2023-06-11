.onUnload <- function(libPath, pkgname) {
  shiny::removeInputHandler('OriginGroupingArray')
  shiny::removeInputHandler('AttrMappingArray')
  shiny::removeInputHandler('AggrFilters')
  shiny::removeInputHandler('HIVModelParams')

  invisible(NULL)
}
