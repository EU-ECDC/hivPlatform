#' PostProcessModelOutputs
#'
#' @param modelOutputs modelOutputs
#' @param preMigrCounts preMigrCounts
#' @param migrConnFlag migrConnFlag
#' @param dataAfterMigr dataAfterMigr
#'
#' @return data.table
#'
#' @export
PostProcessModelOutputs <- function(
  modelOutputs,
  preMigrCounts,
  migrConnFlag,
  dataAfterMigr
) {
  if (migrConnFlag && dataAfterMigr) {
    modelOutputs[preMigrCounts$PreMigrArrY, DiagPriorArrival := i.Count, on = .(Year)]
    modelOutputs[is.na(DiagPriorArrival), DiagPriorArrival := 0]
    modelOutputs[preMigrCounts$PreMigrDiagY1, InfCountryOfOriginPerArrYear := i.Count, on = .(Year)]
    modelOutputs[is.na(InfCountryOfOriginPerArrYear), InfCountryOfOriginPerArrYear := 0]
    modelOutputs[preMigrCounts$PreMigrDiagY2, InfCountryOfOriginPerDiagYear := i.Count, on = .(Year)]
    modelOutputs[is.na(InfCountryOfOriginPerDiagYear), InfCountryOfOriginPerDiagYear := 0]
    modelOutputs[, ':='(
      NewMigrantInfectionsPerArrYear = DiagPriorArrival + InfCountryOfOriginPerArrYear,
      NewMigrantDiagnosesPerDiagYear = DiagPriorArrival + InfCountryOfOriginPerDiagYear
    )]
    modelOutputs[, ':='(
      CumNewMigrantInfectionsPerArrYear = cumsum(NewMigrantInfectionsPerArrYear),
      CumNewMigrantDiagnosesPerDiagYear = cumsum(NewMigrantDiagnosesPerDiagYear)
    )]
    modelOutputs[, ':='(
      #             N_Alive = N_Alive_Diag_M + N_Und
      #                     = Cum_Inf_M - Cum_Dead_D - Cum_Und_Dead_M
      CumInfectionsInclMigr = Cum_Inf_M - Cum_Dead_D - Cum_Und_Dead_M + CumNewMigrantInfectionsPerArrYear,

      #          N_Alive_Diag_M = Cum_HIV_M - Cum_Dead_D
      CumDiagnosedCasesInclMigr = Cum_HIV_M - Cum_Dead_D + CumNewMigrantDiagnosesPerDiagYear
    )]
    modelOutputs[, ':='(
      # Add a comment in the chart that this can be underestimated
      CumUndiagnosedMigrantCases = CumNewMigrantInfectionsPerArrYear - CumNewMigrantDiagnosesPerDiagYear,

      #                     N_Und = N_Alive               - N_Alive_Diag_M
      CumUndiagnosedCasesInclMigr = CumInfectionsInclMigr - CumDiagnosedCasesInclMigr,

      # N_Und_Alive_p =
      #               = (Cum_Inf_M - Cum_Und_Dead_M - Cum_HIV_M) / (Cum_Inf_M - Cum_Dead_D - Cum_Und_Dead_M)
      #               = (N_Alive - N_Alive_Diag_M) / N_Alive
      #               = 1 - N_Alive_Diag_M            / N_Alive
      UndiagnosedFrac = 1 - CumDiagnosedCasesInclMigr / CumInfectionsInclMigr
    )]
  } else {
    modelOutputs[, ':='(
      DiagPriorArrival = NA_real_,
      InfCountryOfOriginPerArrYear = NA_real_,
      InfCountryOfOriginPerDiagYear = NA_real_,
      NewMigrantInfectionsPerArrYear = NA_real_,
      NewMigrantDiagnosesPerDiagYear = NA_real_,
      CumNewMigrantInfectionsPerArrYear = NA_real_,
      CumNewMigrantDiagnosesPerDiagYear = NA_real_,
      CumInfectionsInclMigr = NA_real_,
      CumDiagnosedCasesInclMigr = NA_real_,
      CumUndiagnosedMigrantCases = NA_real_,
      CumUndiagnosedCasesInclMigr = NA_real_,
      UndiagnosedFrac = NA_real_
    )]
  }
  modelOutputs[, ':='(
    InfectionsTotal = N_Inf_M + na.zero(NewMigrantInfectionsPerArrYear),
    AliveTotal =
      N_Alive_Diag_M + N_Und + # Model, = N_Alive
      na.zero(CumNewMigrantDiagnosesPerDiagYear) + na.zero(CumUndiagnosedMigrantCases) # Migrant data module
  )]

  return(invisible(modelOutputs))
}
