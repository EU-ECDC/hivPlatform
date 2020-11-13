#' ApplyOriginGroupingMap
#'
#' Applies RegionOfOrigin grouping map to the input data
#'
#' @param inputData Input data. Required.
#' @param map Data.table object with mapping from RegionOfOrigin to GroupOfOrigin. Required.
#'
#' @return inputData
#'
#' @examples
#' \dontrun{
#' ApplyOriginGroupingMap(inputData, map)
#' }
#'
#' @export
ApplyOriginGroupingMap <- function(inputData, map)
{
  data <- copy(inputData$Table)
  if (length(map) > 0) {
    dtMap <- ConvertListToDt(map)
  } else {
    origin <- data[, sort(unique(FullRegionOfOrigin))]
    dtMap <- data.table(
      name = origin,
      origin = origin
    )
  }

  data[
    dtMap,
    GroupedRegionOfOrigin := name,
    on = c('FullRegionOfOrigin' = 'origin')
  ]

  data[, GroupedRegionOfOrigin := factor(GroupedRegionOfOrigin)]
  inputData$Table <- data

  return(inputData)
}
