#' @export
GetMigrantOutputPlots <- function(
  data,
  ...
) {
  regions <- union('ALL', data[, unique(GroupedRegionOfOrigin)])

  plotsArrival <- lapply(regions, function(region) {
    plotData <- GetMigrantConfBounds(data, 'YearOfArrival', region, 'GroupedRegionOfOrigin', ...)
    if (is.null(plotData)) {
      return(null)
    } else {
      return(list(
        GroupedRegionOfOrigin = region,
        PlotData = plotData[, .(YearOfArrival, PostProp, PostPropLB, PostPropUB)]
      ))
    }
  })
  plotsArrival <- Filter(Negate(is.null), plotsArrival)

  plotsDiagnosis <- lapply(regions, function(region) {
    plotData <- GetMigrantConfBounds(data, 'YearOfHIVDiagnosis', region, 'GroupedRegionOfOrigin', ...)
    if (is.null(plotData)) {
      return(null)
    } else {
      return(list(
        GroupedRegionOfOrigin = region,
        PlotData = plotData[, .(YearOfHIVDiagnosis, PostProp, PostPropLB, PostPropUB)]
      ))
    }
  })
  plotsDiagnosis <- Filter(Negate(is.null), plotsDiagnosis)

  return(list(
    ArrivalPlotData = plotsArrival,
    DiagnosisPlotData = plotsDiagnosis
  ))
}
