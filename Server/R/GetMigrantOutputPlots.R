GetMigrantOutputPlots <- function(
  data
) {
  regions <- union('ALL', data[, unique(GroupedRegionOfOrigin)])

  plotsArrival <- lapply(regions, function(region) {
    plotData <- GetMigrantConfBounds(data, strat = 'YearOfArrival', region, 'GroupedRegionOfOrigin')
    if (is.null(plotData)) {
      return(null)
    } else {
      return(list(
        GroupedRegionOfOrigin = region,
        PlotData = plotData
      ))
    }
  })
  plotsArrival <- Filter(Negate(is.null), plotsArrival)

  plotsDiagnosis <- lapply(regions, function(region) {
    plotData <- GetMigrantConfBounds(data, strat = 'YearOfHIVDiagnosis', region, 'GroupedRegionOfOrigin')
    if (is.null(plotData)) {
      return(null)
    } else {
      return(list(
        GroupedRegionOfOrigin = region,
        PlotData = plotData
      ))
    }
  })
  plotsDiagnosis <- Filter(Negate(is.null), plotsDiagnosis)

  return(list(
    ArrivalPlotData = plotsArrival,
    DiagnosisPlotData = plotsDiagnosis
  ))
}
