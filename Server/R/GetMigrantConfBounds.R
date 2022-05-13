GetMigrantConfBounds <- function(
  data,
  strat = c(),
  region = 'ALL',
  minPresentRatio = 0.9
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
  result <- data[, .(Count = .N), keyby = eval(union('Imputation', allColNames))]
  result <- result[, .(Count = mean(Count)), keyby = allColNames]
  result[
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
    result[,
      Category := paste(lapply(.SD, as.character), collapse = ', '),
      by = seq_len(nrow(result)),
      .SDcols = strataColNames
    ]
  } else {
    result[, Category := 'ALL']
  }

  data <- melt(
    data,
    measure.vars = patterns('^SCtoDiag'),
    variable.name = 'Sample',
    value.name = 'SCtoDiag'
  )
  data[, PreMigrInf := as.integer(SCtoDiag > Mig)]
  strataIdColNames <- as.character(sort(unique(data$StrataId)))

  checkDetailed <- CJ(
    Imputation = unique(data$Imputation),
    Sample = unique(data$Sample),
    StrataId = unique(data$StrataId),
    Present = FALSE
  )
  checkDetailed[
    unique(data[, .(Imputation, Sample, StrataId)]),
    Present := TRUE
  ]
  checkDetailed <- dcast(checkDetailed, Imputation + Sample ~ StrataId, value.var = 'Present')
  checkDetailed[,
    ALL := all(.SD),
    by = .(Idx = seq_len(nrow(checkDetailed))),
    .SDcols = strataIdColNames
  ]
  checkDetailed[,
    ModelId := paste(lapply(.SD, as.character), collapse = '.'),
    by = seq_len(nrow(checkDetailed)),
    .SDcols = c('Imputation', 'Sample')
  ]

  checkAggregated <- transpose(checkDetailed[, lapply(.SD, sum), .SDcols = strataIdColNames])
  setnames(checkAggregated, 'PresentCount')
  checkAggregated[, TotalCount := nrow(checkDetailed)]
  checkAggregated[, PresentRatio := PresentCount / TotalCount]
  checkAggregated[, StrataId := as.integer(strataIdColNames)]
  result[
    checkAggregated,
    ':='(
      PresentCount = i.PresentCount,
      TotalCount = i.TotalCount,
      PresentRatio = i.PresentRatio,
      Algorithm = ifelse(i.PresentRatio >= minPresentRatio, 'GLM', 'MEAN')
    ),
    on = .(StrataId)
  ]

  if (any(result$Algorithm == 'GLM')) {

    dataList <- mitools::imputationList(split(
      data[StrataId %in% result[Algorithm == 'GLM', sort(unique(StrataId))]],
      by = c('Imputation', 'Sample')
    ))
    if (nrow(result[Algorithm == 'GLM']) > 1) {
      models <- with(dataList, glm(PreMigrInf ~ factor(StrataId), family = binomial()))
    } else {
      models <- with(dataList, glm(PreMigrInf ~ 1, family = binomial()))
    }

    betas <- mitools::MIextract(models, fun = coef)
    vars <- mitools::MIextract(models, fun = vcov)

    # checkDetailed <- checkDetailed[match(names(betas), checkDetailed$ModelId)]

    t <- mitools::MIcombine(betas, vars)

    x <- unique(stats::model.matrix(models[[1]]$formula))
    x <- x[, names(betas[[1]])]

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

    result[
      Algorithm == 'GLM',
      ':='(
        PriorProp = InvLogit(est),
        PriorPropLB = InvLogit(lb),
        PriorPropUB = InvLogit(ub)
      )
    ]
  }

  result[Algorithm == 'MEAN', ':='(
    PriorProp = MeanPriorProp,
    PriorPropLB = NA_real_,
    PriorPropUB = NA_real_
  )]

  result[, ':='(
    PostProp = 1 - PriorProp,
    PostPropLB = 1 - PriorPropUB,
    PostPropUB = 1 - PriorPropLB
  )]

  return(list(
    CheckDetailed = checkDetailed,
    CheckAggregated = checkAggregated,
    Result = result
  ))
}
