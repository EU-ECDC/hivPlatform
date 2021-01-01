#' ApplyOriginGrouping
#'
#' Applies RegionOfOrigin grouping map to the input data
#'
#' @param inputData Input data. Required.
#' @param originGrouping Data.table object with mapping from RegionOfOrigin to GroupOfOrigin.
#'   Required.
#'
#' @return inputData
#'
#' @examples
#' \dontrun{
#' ApplyOriginGrouping(inputData, originGrouping)
#' }
#'
#' @export
ApplyOriginGrouping <- function(
  inputData,
  originGrouping
) {
  data <- copy(inputData$Table)
  if (length(originGrouping) > 0) {
    dtMap <- ConvertListToDt(originGrouping)
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
