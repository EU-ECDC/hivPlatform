#' GetAveragePreMigrCounts
#'
#' @param caseData caseData
#' @param migrConnFlag migrConnFlag
#' @param dataAfterMigr dataAfterMigr
#'
#' @return list
#'
#' @export
#' @export
GetAveragePreMigrCounts <- function(
  caseData = NULL,
  migrConnFlag,
  dataAfterMigr
) {
  res <- list(
    PreMigrArrY = NULL,
    PreMigrDiagY1 = NULL,
    PreMigrDiagY2 = NULL
  )

  if (migrConnFlag && dataAfterMigr) {
    # Get counts average over imputations
    imps <- caseData[, sort(unique(Imputation))]
    preMigrCountsList <- lapply(
      imps,
      function(imputation) {
        GetPreMigrCounts(
          caseData[Imputation == imputation],
          migrConnFlag,
          dataAfterMigr
        )
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
