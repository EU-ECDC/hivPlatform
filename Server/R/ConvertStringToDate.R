#' ConvertStringToDate
#'
#' @param str str
#'
#' @return Date
#'
#' @examples
#' ConvertStringToDate(c(NA, 'UNK', '', '2020', '2020-Q1', '2020-W01', '2020-05-20'))
#'
#' @export
ConvertStringToDate <- function(str) {
  nChar <- nchar(str)
  isNA <- str %in% c('', 'UNK', NA_character_)
  isYear <- nChar == 4

  str[isNA] <- NA_character_

  # Expand year to date (mid year)
  str[!isNA & isYear] <- sprintf('%s-07-02', str[!isNA & isYear])

  # Check: support only 10 character strings for conversion
  nChar <- nchar(str[!isNA])
  if (!all(nChar == 10)) {
    warning(
      'Some strings cannot be converted to dates due to unknown format: ',
      paste(head(str[nChar != 10]), collapse = ', ')
    )
    str[nChar != 10] <- NA_character_
  }

  dates <- as.Date(str, '%Y-%m-%d')
  return(dates)
}
