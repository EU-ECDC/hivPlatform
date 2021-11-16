ConvertOriginGroupingArray <- function(
  x,
  session,
  inputname
) {
  originGrouping <- lapply(x, function(el) {
    fullRegionOfOrigin <- ifelse1(
      length(el$FullRegionOfOrigin) == 0,
      NA_character_,
      simplify2array(el$FullRegionOfOrigin)
    )
    list(
      GroupedRegionOfOrigin = el$GroupedRegionOfOrigin,
      FullRegionOfOrigin = fullRegionOfOrigin,
      MigrantRegionOfOrigin = el$MigrantRegionOfOrigin
    )
  })
  return(originGrouping)
}
