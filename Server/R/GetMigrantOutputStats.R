GetMigrantOutputStats <- function(
  data
) {
  # Keep only records with non-missing probability
  data <- data[!is.na(ProbPre)]

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

  GetStatsListOld <- function(dt) {
    list(
      Total = GetStats(dt, colName = 'Total'),
      Sex = GetStats(dt, colName = 'Gender'),
      AgeGroup = GetStats(dt, colName = 'AgeGroup'),
      Transmission = GetStats(dt, colName = 'Transmission'),
      RegionOfOrigin = GetStats(dt, colName = 'RegionOfOrigin')
    )
  }

  GetStatsList <- function(dt) {
    list(
      Total = GetMigrantConfBounds(dt, variables = 'Total'),
      Sex = GetMigrantConfBounds(dt, variables = 'Gender'),
      AgeGroup = GetMigrantConfBounds(dt, variables = 'AgeGroup'),
      Transmission = GetMigrantConfBounds(dt, variables = 'Transmission'),
      RegionOfOrigin = GetMigrantConfBounds(dt, variables = 'RegionOfOrigin')
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
