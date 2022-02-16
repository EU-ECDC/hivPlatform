#' PrepareDataSetsForModel
#'
#' Prepares data sets for HIV Model
#'
#' @param dt Input data set as data.table object. Required.
#' @param splitBy Name of column with values to be used for separation of data sets. Optional.
#'   Default = \code{NULL}
#' @param strata Character vector of strata names. Optional. Default = \code{NULL}
#' @param listIndex Index in the output list to use if 'splitBy' columns does not exist in the
#'   input data set and cannot be used for indexing output data set. If NULL then output file set
#'   is not indexed and returned directly. Optional. Default = 0.
#' @param dataSets Character vector of names of datasets to return.
#'   Default = \code{c('HIV', 'AIDS', 'HIVAIDS', 'Dead', 'CD4')}
#'
#' @return
#' List of HIV models
#'
#' @examples
#' \dontrun{
#'   PrepareDataSetsForModel(dt, splitBy = 'Imputation', strata = 'Transmission', dataSets)
#' }
#'
#' @export
PrepareDataSetsForModel <- function(
  dt,
  splitBy = NULL,
  strata = NULL,
  listIndex = 0,
  dataSets = c('HIV', 'AIDS', 'HIVAIDS', 'Dead', 'CD4')
) {
  if (is.null(dt)) {
    return(NULL)
  }

  WorkFunc <- function(dt) {
    # HIV file
    if ('HIV' %in% dataSets) {
      hiv <- dt[
        !is.na(YearOfHIVDiagnosis),
        .(Count = sum(Weight)),
        keyby = c('YearOfHIVDiagnosis', strata)
      ]
      setnames(hiv, old = c('YearOfHIVDiagnosis'), new = c('Year'))
      if (length(strata) > 0) {
        hiv <- dcast(
          hiv,
          as.formula(sprintf('Year ~ %s', paste(strata, collapse = ' + '))),
          value.var = 'Count'
        )
      }
    } else {
      hiv <- NULL
    }

    # AIDS file
    if ('AIDS' %in% dataSets) {
      aids <- dt[
        !is.na(YearOfAIDSDiagnosis),
        .(Count = sum(Weight)),
        keyby = c('YearOfAIDSDiagnosis', strata)
      ]
      setnames(aids, old = c('YearOfAIDSDiagnosis'), new = c('Year'))
      if (length(strata) > 0) {
        aids <- dcast(
          aids,
          as.formula(sprintf('Year ~ %s', paste(strata, collapse = ' + '))),
          value.var = 'Count'
        )
      }
    } else {
      aids <- NULL
    }

    # HIVAIDS file
    if ('HIVAIDS' %in% dataSets) {
      hivAids <- dt[
        !is.na(YearOfHIVDiagnosis) & !is.na(HIVToAIDSDaysCount) & HIVToAIDSDaysCount <= 90,
        .(Count = sum(Weight)),
        keyby = c('YearOfHIVDiagnosis', strata)
      ]
      setnames(hivAids, old = c('YearOfHIVDiagnosis'), new = c('Year'))
      if (length(strata) > 0) {
        hivAids <- dcast(
          hivAids,
          as.formula(sprintf('Year ~ %s', paste(strata, collapse = ' + '))),
          value.var = 'Count'
        )
      }
    } else {
      hivAids <- NULL
    }

    # CD4 files
    if ('CD4' %in% dataSets) {
      cd4 <- split(
        dt[
          !is.na(YearOfHIVDiagnosis) &
            !is.na(FirstCD4Count) &
            HIVToFirstCD4DaysCount <= 90 &
            (is.na(HIVToAIDSDaysCount) | HIVToAIDSDaysCount > 90)
        ],
        by = 'CD4Category',
        sorted = TRUE
      )
      cd4 <- lapply(cd4, function(d) {
        d <- d[, .(Count = sum(Weight)), keyby = c('YearOfHIVDiagnosis', strata)]
        setnames(d, old = c('YearOfHIVDiagnosis'), new = c('Year'))
        if (length(strata) > 0) {
          d <- dcast(
            d,
            as.formula(sprintf('Year ~ %s', paste(strata, collapse = ' + '))),
            value.var = 'Count'
          )
        }
        return(d)
      })
      if (length(cd4) == 0) {
        cd4 <- list(
          HIV_CD4_1 = data.table(Year = integer(), Count = numeric()),
          HIV_CD4_2 = data.table(Year = integer(), Count = numeric()),
          HIV_CD4_3 = data.table(Year = integer(), Count = numeric()),
          HIV_CD4_4 = data.table(Year = integer(), Count = numeric())
        )
      }
    } else {
      cd4 <- list(
        HIV_CD4_1 = NULL,
        HIV_CD4_2 = NULL,
        HIV_CD4_3 = NULL,
        HIV_CD4_4 = NULL
      )
    }

    # Dead file
    if ('Dead' %in% dataSets) {
      dead <- dt[!is.na(YearOfDeath), .(Count = sum(Weight)), keyby = c('YearOfDeath', strata)]
      setnames(dead, old = c('YearOfDeath'), new = c('Year'))
      if (length(strata) > 0) {
        dead <- dcast(
          dead,
          as.formula(sprintf('Year ~ %s', paste(strata, collapse = ' + '))),
          value.var = 'Count'
        )
      }
    } else {
      dead <- NULL
    }

    dataSet <- modifyList(
      list(
        HIV = hiv,
        AIDS = aids,
        HIVAIDS = hivAids,
        Dead = dead
      ),
      cd4
    )
    dataSet <- Filter(Negate(is.null), dataSet)

    # Ensure all data items have the same columns
    requiredColumns <- Reduce(union, lapply(dataSet, colnames), init = c())

    dataSet <- lapply(
      dataSet,
      function(dt) {
        missingCols <- setdiff(requiredColumns, colnames(dt))
        if (length(missingCols) > 0) {
          dt[, (missingCols) := NA_integer_]
        }
        setcolorder(dt, requiredColumns)
        return(dt)
      }
    )

    return(dataSet)
  }

  if (!('Weight' %in% colnames(dt))) {
    dt[, Weight := 1]
  }
  dt[is.na(DateOfFirstCD4Count), DateOfFirstCD4Count := DateOfHIVDiagnosis]
  dt[, ':='(
    CD4Category = sprintf(
      'HIV_CD4_%d',
      5 - findInterval(FirstCD4Count, c(0, 200, 350, 500, Inf))
    ),
    HIVToAIDSDaysCount = as.integer(DateOfAIDSDiagnosis - DateOfHIVDiagnosis),
    HIVToFirstCD4DaysCount = as.integer(DateOfFirstCD4Count - DateOfHIVDiagnosis),
    YearOfAIDSDiagnosis = year(DateOfAIDSDiagnosis),
    YearOfDeath = year(DateOfDeath)
  )]
  if (!is.null(splitBy) && nrow(dt) > 0) {
    if (splitBy %in% colnames(dt)) {
      dataSets <- lapply(split(dt, by = splitBy), WorkFunc)
    } else if (!is.null(listIndex)) {
      dataSets <- list()
      dataSets[[as.character(listIndex)]] <- WorkFunc(copy(dt))
    } else {
      stop('Column name provided in argument "splitBy" does not exist in the data')
    }
  } else {
    dataSets <- WorkFunc(copy(dt))
  }

  return(dataSets)
}
