#' GetAvailableStrata
#'
#' Get available strata
#'
#' @param dt dt
#' @param colNames colNames
#'
#' @return list
#'
#' @example
#' dt <- data.table::data.table(
#'   Imputation = c(0, 1, 2),
#'   Gender = c('F', 'F', 'M'),
#'   Transmission = c('IDU', 'IDU', 'MSM')
#')
#' GetAvailableStrata(dt, colNames = c('Gender', 'Transmission'))
#'
#' @export
GetAvailableStrata <- function(
  dt,
  colNames
) {
  colNames <- c('Gender', 'Transmission')
  result <- setNames(lapply(colNames, function(attr) {
    dt[Imputation != 0, as.character(unique(get(attr)))]
  }), colNames)

  return(result)
}
