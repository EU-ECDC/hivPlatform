#' CombineData
#'
#' Combines case-based and aggregated data for HIV Model
#'
#' @param caseBasedData Case-based data (before or after adjustments). Required.
#' @param aggregatedData Aggregated data. Required.
#' @param popCombination List of populations to combine per case-based and aggregated data.
#'   Required.
#' @param aggrDataSelection Data.table with specification of aggregated data selection. Contains
#'   columns: \code{DataType}, \code{Use}, \code{MinYear}, \code{MaxYear}
#'
#' @return List of aggregated data asets
#'
#' @examples
#' \dontrun{
#' popCombination <- list(
#'   CaseBasedPopulations = c('Gender_M'),
#'   AggrPopulations = c()
#' )
#' aggrDataSelection <- data.table(
#'   DataType = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
#'   Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
#'   MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
#'   MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
#' )
#' CombineData(caseBasedData, aggregatedData, popCombination, aggrDataSelection)
#' }
#'
#' @export
CombineData <- function(
  caseBasedData,
  aggregatedData,
  popCombination,
  aggrDataSelection
) {
  # 1. Filter case based data
  if (length(popCombination$CaseBasedPopulations) > 0) {
    listObj <- strsplit(popCombination$CaseBasedPopulations, '_')
    columnNames <- vapply(listObj, '[[', 1, FUN.VALUE = character(1))
    values <- vapply(listObj, function(el) {
      if (length(el) > 1) {
        paste(el[-1], collapse = '_')
      } else {
        ''
      }
    }, FUN.VALUE = character(1))
    filters <- data.table(ColumnName = columnNames, Value = values)

    dt1 <- list()
    for (i in seq_len(nrow(filters))) {
      dt1[[i]] <- caseBasedData[as.character(get(filters$ColumnName[i])) %chin% filters$Value[i]]
    }
    dt1 <- rbindlist(dt1)
  } else {
    dt1 <- copy(caseBasedData)
  }
  set1 <- PrepareDataSetsForModel(dt1, splitBy = 'Imputation')

  # 2a. Filter and aggregate populations
  set2 <- lapply(aggregatedData, function(el) {
    if (
      !is.null(popCombination$AggrPopulations) &&
      all(popCombination$AggrPopulations %chin% colnames(el))
    ) {
      el[, .(Count = sum(.SD)), keyby = .(Year), .SDcols = popCombination$AggrPopulations]
    } else {
      data.table(Year = integer(), Count = numeric())
    }
  })

  # 2b. Filter aggregated data on the use flag
  set2 <- setNames(lapply(names(set2), function(dataType) {
    if (dataType %in% aggrDataSelection[Use == TRUE, DataType]) {
      set2[[dataType]]
    } else {
      data.table(Year = integer(), Count = numeric())
    }
  }), names(aggregatedData))

  # 2c. Filter aggregated data on the years
  set2 <- setNames(lapply(names(set2), function(dataType) {
    # dataType <- 'AIDS'
    years <- aggrDataSelection[DataType == dataType, c(MinYear, MaxYear)]
    if (length(years) == 2) {
      set2[[dataType]][Year %between% c(years)]
    } else {
      set2[[dataType]]
    }
  }), names(set2))

  # 3. Combine data sets together
  dataTypes <- c('AIDS', 'Dead', 'HIV', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4', 'HIVAIDS')
  WorkFunc <- function(set1) {
    set1DataTypes <- names(set1)
    set2DataTypes <- names(set2)
    allDataTypes <- union(set1DataTypes, set2DataTypes)
    finalSet <- setNames(lapply(allDataTypes, function(dataType) {
      if (is.null(set1[[dataType]])) {
        set1[[dataType]] <- data.table(Year = integer(), Count = numeric())
      }
      if (is.null(set2[[dataType]])) {
        set2[[dataType]] <- data.table(Year = integer(), Count = numeric())
      }
      result <- merge(
        set1[[dataType]],
        set2[[dataType]],
        by = c('Year'),
        all = TRUE,
        suffixes = c('.CaseBased', '.Aggregated')
      )
      result <- result[, .(Count = na.zero(Count.CaseBased) + na.zero(Count.Aggregated)), keyby = .(Year)]
    }), allDataTypes)
    return(finalSet)
  }

  # Check if this is a single set
  if (any(dataTypes %in% names(set1))) {
    finalSet <- WorkFunc(set1)
  } else {
    finalSet <- lapply(set1, WorkFunc)
  }

  return(finalSet)
}
