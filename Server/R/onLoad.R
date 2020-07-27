.onLoad <- function(libname, pkgname) {
  shiny::registerInputHandler('OriginGroupingArray', ConvertOriginGroupingArray)

  invisible()
}

.onUnload <- function(libname, pkgname) {
  shiny::removeInputHandler('OriginGroupingArray')

  invisible()
}
