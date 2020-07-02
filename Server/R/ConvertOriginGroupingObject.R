ConvertOriginGroupingDtToList <- function(dtMap) {
  groupNames <- unique(dtMap$GroupedRegionOfOrigin)
  listMap <- lapply(groupNames, function(groupName) {
    list(
      GroupedRegionOfOrigin = as.character(groupName),
      FullRegionsOfOrigin = dtMap[GroupedRegionOfOrigin == groupName, sort(unique(FullRegionOfOrigin))],
      GroupedRegionOfOriginCount = dtMap[GroupedRegionOfOrigin == groupName, sort(unique(GroupedRegionOfOriginCount))]
    )
  })
  return(listMap)
}

ConvertOriginGroupingListToDt <- function(dtList) {
  dtMap <- rbindlist(lapply(dtList, as.data.table))
  return(dtMap)
}
