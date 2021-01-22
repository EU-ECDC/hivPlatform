#' ConvertStringToDate
#'
#' @param str str
#'
#' @return Date
#'
#' @examples
#' ConvertStringToDate(str = c(
#'   NA, 'UNK', '', '2020', '2020-Q1', '2020-Q02', '2020-W01', '2020-W45', '2020-05-20', '2020-5-20'
#' ))
#'
#' @export
ConvertStringToDate <- function(
  str
) {
  dates <- rep(as.Date(NA), length(str))

  isYear <- grepl('^[0-9]{4}$', str)
  isQuarter <- grepl('^[0-9]{4}-Q[0-9]{1,2}$', str)
  isWeek <- grepl('^[0-9]{4}-W[0-9]{1,2}$', str)
  isDate <- grepl('^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$', str)

  # Expand year to date (mid year)
  dates[isYear] <- as.Date(sprintf('%s-07-02', str[isYear]), tz = 'UTC')

  # Expand quarter to date (mid quarter)
  strs <- strsplit(str[isQuarter], '-')
  years <- as.integer(sapply(strs, '[[', 1))
  months <- as.integer(sub('^Q', '', sapply(strs, '[[', 2))) * 3 - 1
  dates[isQuarter] <- as.Date(sprintf('%s-%s-15', years, months), tz = 'UTC')

  # Expand week to date (mid week)
  strs <- strsplit(str[isWeek], '-')
  years <- as.integer(sapply(strs, '[[', 1))
  days <- as.integer(sub('^W', '', sapply(strs, '[[', 2))) * 7 - 4
  dates[isWeek] <-
    as.Date(as.POSIXct(sprintf('%s-01-01', years), tz = 'UTC') + days * 86400L, tz = 'UTC')

  dates[isDate] <- as.Date(str[isDate], tz = 'UTC')

  return(dates)
}
