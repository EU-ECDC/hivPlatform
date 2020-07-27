ConvertOriginGroupingArray <- function(
  x,
  session,
  inputname
) {
  originGrouping <- lapply(x, function(el) {
    list(
      GroupedRegionOfOrigin = el$GroupedRegionOfOrigin,
      GroupedRegionOfOriginCount = el$GroupedRegionOfOriginCount,
      FullRegionsOfOrigin = simplify2array(el$FullRegionsOfOrigin)
    )
  })

  return(originGrouping)
}
