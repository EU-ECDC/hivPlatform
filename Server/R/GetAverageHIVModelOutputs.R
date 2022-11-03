#' GetAverageHIVModelOutputs
#'
#' @param hivModels hivModels
#'
#' @return data.table
#'
#' @export
GetAverageHIVModelOutputs <- function(
  hivModels
) {
  if (length(hivModels) == 1) {
    return(hivModels[[1]]$Results$MainOutputs)
  }

  # Average betas
  betas <- as.data.table(lapply(hivModels, function(model) {
    model$Results$Param$Beta
  }))
  betas[, Avg := rowMeans(betas)]
  avgBetas <- betas$Avg

  initModel <- hivModels[[1]]
  popData <- initModel$PopData

  # Average incidence curve
  popDataList <- lapply(hivModels, '[[', 'PopData')
  colNames <- colnames(popData)[-1]
  avgPopData <-
    cbind(
      Year = initModel$PopData$Year,
      as.data.table(setNames(lapply(colNames, function(colName) {
        rowMeans(sapply(popDataList, '[[', colName))
      }), colNames))
    )
  hivModelling:::GetDataWeights(avgPopData)

  # Average incidence curve
  numPoints <- 5000
  minYear <- initModel$Results$Info$ModelMinYear
  maxYear <- initModel$Results$Info$ModelMaxYear
  years <- seq(minYear, maxYear, length.out = numPoints)
  incidenceCurves <- as.data.table(lapply(
    hivModels,
    function(model) {
      sapply(
        years,
        hivModelling:::GetBSpline,
        theta = model$Results$Param$Theta,
        kOrder = model$Results$Info$SplineOrder,
        modelSplineN = model$Results$Info$ModelSplineN,
        myKnots = model$Results$Info$MyKnots,
        minYear = model$Results$Info$ModelMinYear,
        maxYear = model$Results$Info$ModelMaxYear
      )
    }
  ))
  incidenceCurves[, Avg := rowMeans(.SD)]
  avgIncidenceCurve <- as.matrix(incidenceCurves[, .(years, Avg)])

  # Average context
  avgContext <- list(
    Parameters = list(
      INCIDENCE = initModel$Context$Parameters$INCIDENCE
    )
  )

  avgModel <- hivModelling::FitModel(
    beta = avgBetas,
    theta = NA,
    context = avgContext,
    data = avgPopData,
    preCompBSpline = avgIncidenceCurve
  )

  avgModelOutputs <- hivModelling::GetModelOutputs(avgModel, avgPopData)$MainOutputs

  return(avgModelOutputs)
}
