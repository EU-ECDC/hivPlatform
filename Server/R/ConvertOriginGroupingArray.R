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
    migrantRegionOfOrigin <- ifelse(
      length(el$MigrantRegionOfOrigin) == 0,
      NA_character_,
      el$MigrantRegionOfOrigin
    )
    list(
      GroupedRegionOfOrigin = el$GroupedRegionOfOrigin,
      FullRegionOfOrigin = fullRegionOfOrigin,
      MigrantRegionOfOrigin = migrantRegionOfOrigin
    )
  })
  return(originGrouping)
}
