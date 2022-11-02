#' @export
GetPreMigrCounts <- function(
  caseData = NULL
) {
  res <- list(
    PreMigrArrY = NULL,
    PreMigrDiagY1 = NULL,
    PreMigrDiagY2 = NULL
  )

  if (!is.null(caseData)) {
    # Get imputation specific counts
    res$PreMigrArrY <- caseData[
      MigrClass %chin% 'Diagnosed prior to arrival' & !is.na(DateOfArrival),
      .(Count = sum(Weight)),
      keyby = .(Year = year(DateOfArrival))
    ]
    res$PreMigrDiagY1 <- caseData[
      MigrClass %chin% 'Infected in the country of origin',
      .(Count = sum(Weight)),
      keyby = .(Year = year(DateOfArrival))
    ]
    res$PreMigrDiagY2 <- caseData[
      MigrClass %chin% 'Infected in the country of origin',
      .(Count = sum(Weight)),
      keyby = .(Year = YearOfHIVDiagnosis)
    ]
  }

  return(res)
}

#' @export
GetAveragePreMigrCounts <- function(
  caseData = NULL
) {
  res <- list(
    PreMigrArrY = NULL,
    PreMigrDiagY1 = NULL,
    PreMigrDiagY2 = NULL
  )

  if (!is.null(caseData)) {
    # Get counts average over imputations
    imps <- caseData[, sort(unique(Imputation))]
    preMigrCountsList <- lapply(
      imps,
      function(imputation) {
        GetPreMigrCounts(caseData[Imputation == imputation])
      }
    )
    itemNames <- c('PreMigrArrY', 'PreMigrDiagY1', 'PreMigrDiagY2')
    res <- setNames(lapply(
      itemNames,
      function(itemName) {
        itemsList <- lapply(preMigrCountsList, '[[', itemName)
        for (i in seq_along(itemsList)) {
          itemsList[[i]][, Imputation := i]
        }
        itemsList <- rbindlist(itemsList)
        item <- dcast(itemsList, Year ~ Imputation, value.var = 'Count', fill = 0)
        item[, Avg := rowMeans(.SD), keyby = .(Year), .SDcols = setdiff(colnames(item), 'Year')]
        item[, .(Year, Count = Avg)]
      }
    ), itemNames)
  }

  return(res)
}
