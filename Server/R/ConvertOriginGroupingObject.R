ConvertOriginGroupingDtToList <- function(dtMap) {
  groupNames <- unique(dtMap$name)
  listMap <- lapply(groupNames, function(groupName) {
    list(
      name = as.character(groupName),
      origin = dtMap[name == groupName, sort(unique(origin))],
      groupCount = dtMap[name == groupName, sort(unique(groupCount))]
    )
  })
  return(listMap)
}

ConvertOriginGroupingListToDt <- function(dtList) {
  dtMap <- rbindlist(lapply(dtList, as.data.table))
  return(dtMap)
}
