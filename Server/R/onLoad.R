.onLoad <- function(libPath, pkgname) {
  shiny::registerInputHandler('OriginGroupingArray', ConvertOriginGroupingArray, force = TRUE)
  shiny::registerInputHandler('AttrMappingArray', ConvertAttrMappingArray, force = TRUE)
  shiny::registerInputHandler('AggrFilters', ConvertAggrFilters, force = TRUE)
  shiny::registerInputHandler('HIVModelParams', ConvertHIVModelParams, force = TRUE)

  invisible(NULL)
}
