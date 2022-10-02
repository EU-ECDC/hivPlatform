#' GetMigrantOutputPlots
#'
#' Get migrant output plots data
#'
#' @param data data
#' @param ... Additional arugmnents passed to \code{\link{GetMigrantConfBounds}}
#'
#' @return list
#'
#' @examples
#' \dontrun{
#' GetMigrantOutputPlots(
#'   data,
#'   strat = c(),
#'   region = 'ALL',
#'   regionColumn = 'MigrantRegionOfOrigin',
#'   minPresentRatio = 0.9,
#'   detailed = FALSE
#' )
#' }
#'
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
        PlotData = plotData[, .(YearOfArrival, PostProp, PostPropLB, PostPropUB, Count)]
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
        PlotData = plotData[, .(YearOfHIVDiagnosis, PostProp, PostPropLB, PostPropUB, Count)]
      ))
    }
  })
  plotsDiagnosis <- Filter(Negate(is.null), plotsDiagnosis)

  return(list(
    ArrivalPlotData = plotsArrival,
    DiagnosisPlotData = plotsDiagnosis
  ))
}
