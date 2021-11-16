ConvertOriginGroupingDtToList <- function(
  dtMap
) {
  groupNames <- unique(dtMap$GroupedRegionOfOrigin)
  listMap <- lapply(groupNames, function(groupName) {
    dtMapGroup <- dtMap[GroupedRegionOfOrigin == groupName]
    list(
      GroupedRegionOfOrigin = groupName,
      FullRegionOfOrigin = dtMapGroup[, sort(unique(FullRegionOfOrigin))],
      MigrantRegionOfOrigin = dtMapGroup[, sort(unique(MigrantRegionOfOrigin))]
    )
  })
  return(listMap)
}
