GetMigrantOutputStats <- function(
  output
) {
  isOriginalData <- output[, all(Imputation == 0)]
  if (!isOriginalData) {
    output <- output[Imputation > 0]
  }
  output <- output[!is.na(ProbPre)]

  output[, ':='(
    Total = 'Total',
    AgeGroup = cut(
      Age,
      breaks = c(-Inf, 25, 40, 55, Inf),
      labels = c('< 25', '25 - 39', '40 - 54', '55+'),
      right = FALSE
    )
  )]

  GetStats <- function(
    colName = NULL
  ) {
    uniqueVals <- output[, unique(get(colName))]
    stats <- rbindlist(lapply(uniqueVals, function(uniqueVal) {
      imputeStats <- output[
        get(colName) == uniqueVal,
        .(
          Category = uniqueVal,
          Count = .N,
          PriorProp = sum(ProbPre > 0.5) / .N,
          PostProp = sum(ProbPre <= 0.5) / .N
        ),
        by = .(Imputation)
      ]

      stats <- imputeStats[,
        .(
          Count = mean(Count),
          PriorProp = mean(PriorProp),
          PriorPropLB = quantile(PriorProp, na.rm = TRUE, probs = c(0.025)),
          PriorPropUB = quantile(PriorProp, na.rm = TRUE, probs = c(0.975)),
          PostProp = mean(PostProp),
          PostPropLB = quantile(PostProp, na.rm = TRUE, probs = c(0.025)),
          PostPropUB = quantile(PostProp, na.rm = TRUE, probs = c(0.975))
        ),
        by = .(Category)
      ]
      return(stats)
    }))
  }

  stats <- list(
    Total = GetStats(colName = 'Total'),
    Sex = GetStats(colName = 'Gender'),
    AgeGroup = GetStats(colName = 'AgeGroup'),
    Transmission = GetStats(colName = 'Transmission'),
    RegionOfOrigin = GetStats(colName = 'RegionOfOrigin')
  )

  return(stats)
}
