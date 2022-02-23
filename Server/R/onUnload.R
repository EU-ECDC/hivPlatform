.onUnload <- function(libPath, pkgname) {
  shiny::removeInputHandler('OriginGroupingArray')
  shiny::removeInputHandler('AttrMappingArray')
  shiny::removeInputHandler('AggrFilters')
  shiny::removeInputHandler('HIVModelParams')

  library.dynam.unload('hivPlatform', libPath)

  invisible(NULL)
}
