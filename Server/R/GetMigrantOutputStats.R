GetMigrantOutputStats <- function(
  data
) {
  isOriginalData <- data[, all(Imputation == 0)]
  # Keep only either original or imputed data, never both.
  if (!isOriginalData) {
    data <- data[Imputation > 0]
  }
  # Keep only records with non-missing probability
  data <- data[!is.na(ProbPre)]

  data[, ':='(
    Total = 'Total',
    AgeGroup = cut(
      Age,
      breaks = c(-Inf, 25, 40, 55, Inf),
      labels = c('< 25', '25 - 39', '40 - 54', '55+'),
      right = FALSE
    )
  )]
  data[
    MigrantRegionOfOrigin %chin% c('CARIBBEAN-LATIN AMERICA'),
    MigrantRegionOfOrigin := 'OTHER'
  ]

  GetStats <- function(
    dt = NULL,
    colName = NULL
  ) {
    uniqueVals <- dt[, sort(unique(get(colName)))]
    stats <- rbindlist(lapply(uniqueVals, function(uniqueVal) {
      imputeStats <- dt[
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

  GetStatsList <- function(dt) {
    list(
      Total = GetStats(dt, colName = 'Total'),
      Sex = GetStats(dt, colName = 'Gender'),
      AgeGroup = GetStats(dt, colName = 'AgeGroup'),
      Transmission = GetStats(dt, colName = 'Transmission'),
      RegionOfOrigin = GetStats(dt, colName = 'RegionOfOrigin')
    )
  }

  migrantRegions <- data[, unique(MigrantRegionOfOrigin)]
  stats <- setNames(lapply(migrantRegions, function(migrantRegion) {
    GetStatsList(data[MigrantRegionOfOrigin == migrantRegion])
  }), migrantRegions)

  stats[['ALL']] <- GetStatsList(data)

  return(list(
    TableDistr = stats
  ))
}
