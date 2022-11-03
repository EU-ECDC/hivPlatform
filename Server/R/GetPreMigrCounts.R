#' GetPreMigrCounts
#'
#' @param caseData caseData
#' @param migrConnFlag migrConnFlag
#' @param dataAfterMigr dataAfterMigr
#'
#' @return list
#'
#' @export
GetPreMigrCounts <- function(
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
