ConvertOriginGroupingDtToList <- function(dtMap) {
  groupNames <- unique(dtMap$name)
  listMap <- lapply(groupNames, function(groupName) {
    list(
      name = groupName,
      origin = dtMap[name == groupName, sort(unique(origin))]
    )
  })
  return(listMap)
}

ConvertOriginGroupingListToDt <- function(dtList) {
  dtMap <- rbindlist(lapply(dtList, as.data.table))
  return(dtMap)
}
