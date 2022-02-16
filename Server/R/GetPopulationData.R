#' GetPopulationData
#'
#' Filters case-based and aggregated data populations
#'
#' @param caseData Case-based data (before or after adjustments). Required.
#' @param aggrData Aggregated data. Required.
#' @param popCombination List of populations to combine per case-based and aggregated data.
#'   Required.
#' @param aggrDataSelection Data.table with specification of aggregated data selection. Contains
#'   columns: \code{DataType}, \code{Use}, \code{MinYear}, \code{MaxYear}
#'
#' @return List of case-based and aggregated data asets
#'
#' @examples
#' \dontrun{
#' popCombination <- list(
#'   Case = list(Values = c('M'), Variables = c('Gender')),
#'   Aggr = c('pop_0')
#' )
#' aggrDataSelection <- data.table(
#'   Name = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
#'   Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
#'   MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
#'   MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
#' )
#' GetPopulationData(casedData, aggrData, popCombination, aggrDataSelection)
#' }
#'
#' @export
GetPopulationData <- function(
  caseData,
  aggrData,
  popCombination = NULL,
  aggrDataSelection = NULL
) {
  if (!is.data.table(aggrDataSelection) && is.list(aggrDataSelection)) {
    aggrDataSelection <- ConvertListToDt(aggrDataSelection)
  }

  # 1. Filter case based data
  if (!is.null(caseData) && length(popCombination$Case) > 0) {
    dt1 <- list()
    for (i in seq_along(popCombination$Case)) {
      combination <- popCombination$Case[[i]]
      dt1[[i]] <- list()
      for (j in seq_along(combination$Variables)) {
        dt1[[i]][[j]] <-
          caseData[as.character(get(combination$Variables[j])) %chin% combination$Values[j]]
      }
    }
    dt1 <- rbindlist(lapply(dt1, rbindlist))
  } else {
    dt1 <- copy(caseData)
  }

  if (!is.null(aggrData) && length(popCombination$Aggr) > 0) {
    # 2a. Filter and aggregate populations
    set2 <- lapply(aggrData, function(el) {
      if (all(popCombination$Aggr %chin% colnames(el))) {
        el[, .(Count = sum(.SD)), keyby = .(Year), .SDcols = popCombination$Aggr]
      } else {
        data.table(Year = integer(), Count = numeric())
      }
    })
    if (!is.null(aggrDataSelection)) {
      # 2b. Filter aggregated data on the use flag
      set2 <- setNames(lapply(names(set2), function(dataName) {
        if (dataName %in% aggrDataSelection[Use == TRUE, Name]) {
          set2[[dataName]]
        } else {
          data.table(Year = integer(), Count = numeric())
        }
      }), names(aggrData))

      # 2c. Filter aggregated data on the years
      set2 <- setNames(lapply(names(set2), function(dataName) {
        years <- aggrDataSelection[Name == dataName, c(MinYear, MaxYear)]
        if (length(years) == 2) {
          set2[[dataName]][Year %between% c(years)]
        } else {
          set2[[dataName]]
        }
      }), names(set2))
    }
  } else {
    set2 <- NULL
  }

  return(list(
    Case = dt1,
    Aggr = set2
  ))
}
