ConvertOriginGroupingDtToList <- function(dtMap) {
  groupNames <- unique(dtMap$GroupedRegionOfOrigin)
  listMap <- setNames(lapply(groupNames, function(groupName) {
    dtMap[GroupedRegionOfOrigin == groupName, unique(FullRegionOfOrigin)]
  }), groupNames)
  return(listMap)
}

ConvertOriginGroupingListToDt <- function(dtList) {
  groupNames <- names(listMap)
  dtMap <- rbindlist(lapply(groupNames, function(groupName) {
    data.table(
      FullRegionOfOrigin = listMap[[groupName]],
      GroupedRegionOfOrigin = groupName
    )
  }))
  return(dtMap)
}
