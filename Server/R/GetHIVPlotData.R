#' GetHIVPlotData
#'
#' Get HIV plot data
#'
#' @param mainFitOutputs mainFitOutputs
#' @param bootstrapFitStats bootstrapFitStats
#' @param parameters parameters
#'
#' @return data.table
#'
#' @examples
#' \dontrun{
#' GetHIVPlotData(
#'   mainFitOutputs,
#'   bootstrapFitStats,
#'   parameters,
#'   migrConnFlag
#' )
#' }
#'
#' @export
GetHIVPlotData <- function(
  mainFitOutputs,
  bootstrapFitStats = NULL,
  parameters = NULL
) {
  colNames <- c(
    'Year',
    'N_HIV_D', 'N_HIV_Obs_M',
    'N_CD4_1_D', 'N_CD4_1_Obs_M',
    'N_CD4_2_D', 'N_CD4_2_Obs_M',
    'N_CD4_3_D', 'N_CD4_3_Obs_M',
    'N_CD4_4_D', 'N_CD4_4_Obs_M',
    'N_HIVAIDS_D', 'N_HIVAIDS_Obs_M',
    'N_AIDS_D', 'N_AIDS_M',
    'N_Inf_M',
    't_diag', 't_diag', 't_diag_p25', 't_diag_p50',
    'D_Avg_Time',
    'N_Alive', 'N_Alive_Diag_M', 'N_Und',
    'N_Und_Alive_p',
    'N_Und_CD4_3_M', 'N_Und_CD4_4_M',
    'DiagPriorArrival', 'InfCountryOfOriginPerArrYear', 'InfCountryOfOriginPerDiagYear',
    'CumNewMigrantInfectionsPerArrYear', 'NewMigrantDiagnosesPerDiagYear',
    'CumNewMigrantInfectionsPerArrYear', 'CumNewMigrantDiagnosesPerDiagYear',
    'CumInfectionsInclMigr', 'CumDiagnosedCasesInclMigr',
    'CumUndiagnosedMigrantCases',
    'CumUndiagnosedCasesInclMigr', 'UndiagnosedFrac',
    'InfectionsTotal', 'AliveTotal'
  )
  dataColNames <- c(
    'N_HIV_D', 'N_CD4_1_D', 'N_CD4_2_D', 'N_CD4_3_D', 'N_CD4_4_D', 'N_HIVAIDS_D', 'N_AIDS_D'
  )
  dt <- mainFitOutputs[, ..colNames]
  if (!is.null(parameters)) {
    dt[, ':='(
      N_HIV_D_Used = between(Year, parameters$FitPosMinYear, parameters$FitPosMaxYear),
      N_CD4_1_D_Used = between(Year, parameters$FitPosCD4MinYear, parameters$FitPosCD4MaxYear),
      N_CD4_2_D_Used = between(Year, parameters$FitPosCD4MinYear, parameters$FitPosCD4MaxYear),
      N_CD4_3_D_Used = between(Year, parameters$FitPosCD4MinYear, parameters$FitPosCD4MaxYear),
      N_CD4_4_D_Used = between(Year, parameters$FitPosCD4MinYear, parameters$FitPosCD4MaxYear),
      N_HIVAIDS_D_Used = between(Year, parameters$FitAIDSPosMinYear, parameters$FitAIDSPosMaxYear),
      N_AIDS_D_Used = between(Year, parameters$FitAIDSMinYear, parameters$FitAIDSMaxYear)
    )]
  } else {
    dt[, ':='(
      N_HIV_D_Used = TRUE,
      N_CD4_1_D_Used = TRUE,
      N_CD4_2_D_Used = TRUE,
      N_CD4_3_D_Used = TRUE,
      N_CD4_4_D_Used = TRUE,
      N_HIVAIDS_D_Used = TRUE,
      N_AIDS_D_Used = TRUE
    )]
  }

  if (!is.null(bootstrapFitStats)) {
    confColNames <- names(bootstrapFitStats$MainOutputsStats)
    for (colName in setdiff(colNames, dataColNames)) {
      if (colName %in% confColNames) {
        confBounds <- bootstrapFitStats$MainOutputsStats[[colName]]
        colNames <- paste(colName, c('LB', 'UB', 'Count'), sep = '_')
        dt[confBounds, (colNames) := .(i.LB, i.UB, i.Count), on = .(Year)]
      }
    }
  }

  return(dt)
}
