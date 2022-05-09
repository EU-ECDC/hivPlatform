GetSplines <- function(
  model,
  theta = model$Results$Param$Theta
) {
  years <- seq(model$Results$Info$ModelMinYear, model$Results$Info$ModelMaxYear)
  res <- sapply(
    years,
    hivModelling:::GetBSpline,
    theta = theta,
    kOrder = model$Results$Info$SplineOrder,
    modelSplineN = model$Results$Info$ModelSplineN,
    myKnots = model$Results$Info$MyKnots,
    minYear = model$Results$Info$ModelMinYear,
    maxYear = model$Results$Info$ModelMaxYear
  )

  return(res)
}
