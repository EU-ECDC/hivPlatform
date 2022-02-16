#' CombineData
#'
#' Combines two aggregated data sets for HIV Model.
#' Data is set 2 overrides data in set 1.
#'
#' @param set1 Set 1, case-based data. Optional.
#' @param set2 Set 2, aggregated data. Optional.
#'
#' @return Combined data set - a list of aggregated data sets
#'
#' @examples
#' \dontrun{
#' CombineData(set1, set2)
#' }
#'
#' @export
CombineData <- function(
  set1,
  set2
) {
  WorkFunc <- function(set1) {
    set1DataNames <- names(set1)
    set2DataNames <- names(set2)
    allDataNames <- union(set1DataNames, set2DataNames)
    finalSet <- setNames(lapply(allDataNames, function(dataName) {
      if (is.null(set1[[dataName]])) {
        set1[[dataName]] <- data.table(Year = integer(), Count = numeric())
      }
      if (is.null(set2[[dataName]])) {
        set2[[dataName]] <- data.table(Year = integer(), Count = numeric())
      }
      result <- merge(
        set1[[dataName]],
        set2[[dataName]],
        by = c('Year'),
        all = TRUE,
        suffixes = c('.Set1', '.Set2')
      )

      if (nrow(set2[[dataName]]) > 0) {
        yearsSeq <- set2[[dataName]][, seq(min(Year, na.rm = TRUE), max(Year, na.rm = TRUE))]
      } else {
        yearsSeq <- integer()
      }

      result[, ':='(
        Count = ifelse(Year %in% yearsSeq, Count.Set2, Count.Set1),
        Count.Set1 = NULL,
        Count.Set2 = NULL
      )]
    }), allDataNames)
    return(finalSet)
  }

  # Check if this is a single set
  if (!is.null(set1)) {
    dataNames <-
      c('AIDS', 'Dead', 'HIV', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4', 'HIVAIDS')
    if (any(dataNames %in% names(set1))) {
      finalSet <- list('0' = WorkFunc(set1))
    } else {
      finalSet <- lapply(set1, WorkFunc)
    }
  } else if (!is.null(set2)) {
    finalSet <- list('0' = set2)
  } else {
    finalSet <- NULL
  }

  return(finalSet)
}
