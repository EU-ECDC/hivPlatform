GetHeatMapChartData <- function(
  distrData,
  chartCategoriesX = colnames(distrData)[-1],
  chartCategoriesY = distrData[[1]]
) {
  matrixData <- unname(as.matrix(distrData[, ..chartCategoriesX]))
  dims <- dim(matrixData)
  values <- matrix(matrixData, nrow = prod(dims), ncol = 1, byrow = TRUE)
  seriesData <- cbind(
    rep(seq_len(dims[2]) - 1, each = dims[1]),
    rep(seq_len(dims[1]) - 1, times = dims[2]),
    values
  )
  dataMax <- max(values)
  return(
    list(
      chartCategoriesX = chartCategoriesX,
      chartCategoriesY = chartCategoriesY,
      seriesData = seriesData,
      dataMax = dataMax
    )
  )
}
