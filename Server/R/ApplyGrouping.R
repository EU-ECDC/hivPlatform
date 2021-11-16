#' ApplyGrouping
#'
#' Applies grouping map to the input data
#'
#' @param inputData Input data. Required.
#' @param originGrouping List object with mapping. Required.
#' @param from Column name for mapping from
#' @param to Column name for mapping to
#'
#' @return inputData
#'
#' @examples
#' \dontrun{
#' ApplyGrouping(
#'   inputData,
#'   originGrouping,
#'   from = 'FullRegionOfOrigin',
#'   to = 'GroupedRegionOfOrigin'
#' )
#' }
#'
#' @export
ApplyGrouping <- function(
  inputData,
  originGrouping,
  from = 'FullRegionOfOrigin',
  to = 'GroupedRegionOfOrigin'
) {
  inputData[is.na(get(from)), (from) := 'UNK']
  if (to %in% colnames(inputData)) {
    inputData[, (to) := NULL]
  }

  if (length(originGrouping) > 0) {
    cols <- c(from, to)
    dtMap <- unique(ConvertListToDt(originGrouping)[, ..cols])
    inputData <- merge(
      inputData,
      dtMap,
      by = from,
      all.x = TRUE
    )
    inputData[is.na(get(to)), (to) := get(from)]
  } else {
    inputData[, (to) := get(from)]
  }

  inputData[get(to) == 'UNK', (to) := NA_character_]
  inputData[get(from) == 'UNK', (from) := NA_character_]
  return(inputData)
}
