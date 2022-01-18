GetMigrantOutputPlots <- function(
  data,
  asJSON = FALSE
) {
  isOriginalData <- data[, all(Imputation == 0)]
  # Keep only either original or imputed data, never both.
  if (!isOriginalData) {
    data <- data[Imputation > 0]
  }
  # Keep only records with non-missing probability
  data <- data[!is.na(ProbPre)]

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

  if (asJSON) {
    res <- ConvertObjToJSON(res, dataframe = 'columns')
  }

  return(res)
}
