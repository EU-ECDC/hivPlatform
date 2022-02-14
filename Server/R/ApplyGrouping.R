#' ApplyGrouping
#'
#' Applies grouping map to the input data
#'
#' @param data Data. Required.
#' @param originGrouping List object with mapping. Required.
#' @param from Column name for mapping from
#' @param to Column name for mapping to
#' @param asFactor Logical indicating to convert "from" and "to" columns to factor.
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
  data,
  originGrouping,
  from = 'FullRegionOfOrigin',
  to = 'GroupedRegionOfOrigin',
  asFactor = FALSE
) {
  if (to %in% colnames(data)) {
    data[, (to) := NULL]
  }

  data[is.na(get(from)), (from) := 'UNK']
  if (length(originGrouping) > 0) {
    cols <- c(from, to)
    dtMap <- unique(ConvertListToDt(originGrouping)[, ..cols])
    data[
      dtMap,
      (to) := get(to),
      on = from
    ]
  } else {
    data[, (to) := NA_character_]
  }
  data[get(to) == 'UNK', (to) := NA_character_]
  data[get(from) == 'UNK', (from) := NA_character_]

  if (asFactor) {
    data[, (from) := as.factor(get(from))]
    data[, (to) := as.factor(get(to))]
  }

  return(invisible(data))
}
