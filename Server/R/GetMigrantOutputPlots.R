GetMigrantOutputPlots <- function(
  data
) {
  # Keep only records with non-missing probability
  data <- data[FinalData == TRUE & !is.na(ProbPre)]

  isOriginalData <- data[, all(Imputation == 0)]

  GetPlotData <- function(colName) {
    imputeData <- data[,
      .(PostProp = sum(ProbPre <= 0.5) / .N),
      keyby = .(
        Imputation,
        Year = year(get(colName))
      )
    ]
    if (isOriginalData) {
      plotData <- imputeData[, .(PostProp = mean(PostProp)), keyby = .(Year)]
    } else {
      plotData <- imputeData[,
        .(
          PostProp = mean(PostProp),
          PostPropLB = quantile(PostProp, na.rm = TRUE, probs = c(0.025)),
          PostPropUB = quantile(PostProp, na.rm = TRUE, probs = c(0.975))
        ),
        keyby = .(Year)
      ]
      plotData[, PostPropRange := PostPropUB - PostPropLB]
    }
  }

  arrivalPlotData <- GetPlotData('DateOfArrival')
  diagnosisPlotData <- GetPlotData('DateOfHIVDiagnosis')

  res <- list(
    ArrivalPlotData = arrivalPlotData,
    DiagnosisPlotData = diagnosisPlotData
  )

  return(res)
}
