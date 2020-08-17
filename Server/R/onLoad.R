.onLoad <- function(libname, pkgname) {
  shiny::registerInputHandler('OriginGroupingArray', ConvertOriginGroupingArray)
  shiny::registerInputHandler('AttrMappingArray', ConvertAttrMappingArray)

  invisible()
}

.onUnload <- function(libname, pkgname) {
  shiny::removeInputHandler('OriginGroupingArray')
  shiny::removeInputHandler('AttrMappingArray')

  invisible()
}
