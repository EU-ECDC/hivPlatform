GetMigrantConfBounds <- function(
  data,
  strat = c(),
  region = 'ALL'
) {
  if (!(region %in% c('ALL', ''))) {
    data <- data[MigrantRegionOfOrigin == region]
  }

  # Keep only records with non-missing probability
  data <- data[!is.na(ProbPre)]

  strataColNames <- intersect(strat, colnames(data))
  setorderv(data, strataColNames)
  data[, StrataId := .GRP, by = strataColNames]
  allColNames <- union(strataColNames, 'StrataId')
  combinations <- data[, .(Count = .N), keyby = eval(union('Imputation', allColNames))]
  combinations <- combinations[, .(AverageCount = mean(Count)), keyby = allColNames]
  combinations[
    data[, .(
      MedianPriorProp = median(ProbPre),
      MeanPriorProp = mean(ProbPre)
    ),
    keyby = StrataId
    ],
    ':='(
      MedianPriorProp = i.MedianPriorProp,
      MeanPriorProp = i.MeanPriorProp
    ),
    on = 'StrataId'
  ]
  if (length(strataColNames) > 0) {
    combinations[,
      Category := paste(lapply(.SD, as.character), collapse = ', '),
      by = seq_len(nrow(combinations)),
      .SDcols = strataColNames
    ]
  } else {
    combinations[, Category := 'ALL']
  }

  data <- melt(
    data,
    measure.vars = patterns('^SCtoDiag'),
    variable.name = 'Sample',
    value.name = 'SCtoDiag'
  )
  data[, PreMigrInf := as.integer(SCtoDiag > Mig)]
  dataList <- mitools::imputationList(split(data, by = c('Imputation', 'Sample')))

  strataIds <- data[, sort(unique(StrataId))]
  if (nrow(combinations) > 1) {
    models <- with(dataList, glm(PreMigrInf ~ factor(StrataId), family = binomial()))
    checkVec <- rep(FALSE, length(strataIds))
    checkDetailed <- as.data.table(transpose(lapply(models, function(model) {
      res <- checkVec
      res[as.integer(model$xlevels[[1]])] <- TRUE
      return(res)
    })))
  } else {
    models <- with(dataList, glm(PreMigrInf ~ 1, family = binomial()))
    checkDetailed <- data.table(rep(TRUE, length(models)))
  }
  setnames(checkDetailed, as.character(strataIds))
  checkDetailed[,
    ALL := all(.SD),
    by = .(Idx = seq_len(nrow(checkDetailed))),
    .SDcols = as.character(strataIds)
  ]

  checkAggregated <- transpose(checkDetailed[, lapply(.SD, sum)])
  setnames(checkAggregated, 'PresentCount')
  checkAggregated[, TotalCount := length(models)]
  checkAggregated[, PresentRatio := PresentCount / TotalCount]
  checkAggregated[, StrataId := colnames(checkDetailed)]
  checkAggregated[
    combinations[, .(StrataId = as.character(StrataId), Category)],
    Category := i.Category,
    on = .(StrataId)
  ]
  checkAggregated[StrataId == 'ALL', Category := 'ALL']

  if (checkAggregated[StrataId == 'ALL', PresentRatio > 0.9]) {
    betas <- mitools::MIextract(models, fun = coef)
    vars <- mitools::MIextract(models, fun = vcov)

    t <- mitools::MIcombine(betas[checkDetailed$ALL], vars[checkDetailed$ALL])

    x <- unique(stats::model.matrix(models[[1]]$formula))
    x <- x[, names(betas[checkDetailed$ALL][[1]])]

    naCoef <- which(is.na(t$coefficients))
    if (length(naCoef) > 0) {
      x <- x[, -naCoef]
      coefficients <- t$coefficients[-naCoef]
      variance <- t$variance[-naCoef, -naCoef]
    } else {
      coefficients <- t$coefficients
      variance <- t$variance
    }

    est <- as.vector(x %*% coefficients)
    bound <- qnorm(0.975) * sqrt(diag(x %*% variance %*% t(x)))
    lb <- est - bound
    ub <- est + bound

    result <- data.table(
      combinations[, .(Category, Count = AverageCount)],
      PriorProp = InvLogit(est),
      PriorPropLB = InvLogit(lb),
      PriorPropUB = InvLogit(ub)
    )
    algorithmUsed <- 'GLM'
  } else {
    PrintAlert('Stratification too granular. Median probability reported.', type = 'warning')
    result <- combinations[, .(
      Category,
      Count = AverageCount,
      PriorProp = MedianPriorProp,
      PriorPropLB = NA_real_,
      PriorPropUB = NA_real_
    )]
    algorithmUsed <- 'MEDIAN'
  }
  result[, ':='(
    PostProp = 1 - PriorProp,
    PostPropLB = 1 - PriorPropUB,
    PostPropUB = 1 - PriorPropLB
  )]

  return(list(
    AlgorithmUsed = algorithmUsed,
    CheckDetailed = checkDetailed,
    CheckAggregated = checkAggregated,
    Combinations = combinations,
    Result = result
  ))
}
