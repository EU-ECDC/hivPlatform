#' GetCuts
#'
#' Get cuts for VarX to be used in RD estimation with time trend
#'
#' @param data data
#' @param count count of cuts
#'
#' @return vector of integers
#'
#' @examples
#' data <- data.table::data.table(
#'   VarXs = 58L:68L
#' )
#' GetCuts(data, count = 3L)
#'
#' @export
GetCuts <- function(
  data,
  count = 3L
) {
  dt <- data[, .(Count = .N), keyby = .(VarXs)]
  groupSize <- ceiling(nrow(dt) / count)
  dt[, Id := seq_len(.N)]
  dt[, tgroup := (Id - 1L) %/% groupSize + 1L]
  dt[, nextTGroup := shift(tgroup, -1)]
  dt[is.na(nextTGroup), nextTGroup := tgroup + 1]
  dt[, groupChange := tgroup != nextTGroup]
  cuts <- dt[groupChange == TRUE, sort(unique(VarXs))]
  return(cuts)
}
