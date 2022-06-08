GetMigrantOutputPlots <- function(
  data
) {
  migrantRegions <- union('ALL', data[, unique(MigrantRegionOfOrigin)])
  plotsArrival <- setNames(lapply(migrantRegions, function(region) {
    GetMigrantConfBounds(data, strat = 'YearOfArrival', region)
  }), migrantRegions)
  plotsDiagnosis <- setNames(lapply(migrantRegions, function(region) {
    GetMigrantConfBounds(data, strat = 'YearOfHIVDiagnosis', region)
  }), migrantRegions)

  return(list(
    ArrivalPlotData = plotsArrival,
    DiagnosisPlotData = plotsDiagnosis
  ))
}
