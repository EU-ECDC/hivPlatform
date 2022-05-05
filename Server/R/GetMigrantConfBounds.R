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
  data[, StrataId := .GRP, by = strataColNames]
  allColNames <- union(strataColNames, 'StrataId')
  combinations <- data[, .(Count = .N), keyby = eval(union('Imputation', allColNames))]
  combinations <- combinations[, .(Count = mean(Count)), keyby = allColNames]
  combinations[
    data[, .(PriorProp = median(ProbPre)), keyby = StrataId],
    PriorProp := i.PriorProp,
    on = 'StrataId'
  ]
  combinations[,
    Category := paste(.SD, collapse = ', '),
    by = seq_len(nrow(combinations)),
    .SDcols = strataColNames
  ]

  data <- melt(
    data,
    measure.vars = patterns('^SCtoDiag'),
    variable.name = 'Sample',
    value.name = 'SCtoDiag'
  )
  data[, PreMigrInf := as.integer(SCtoDiag > Mig)]
  dataList <- mitools::imputationList(split(data, by = c('Imputation', 'Sample')))

  if (nrow(combinations) > 1) {
    models <- with(dataList, glm(PreMigrInf ~ factor(StrataId), family = binomial()))
    expLength <- length(unique(data$StrataId))
  } else {
    models <- with(dataList, glm(PreMigrInf ~ 1, family = binomial()))
    expLength <- 1
  }

  betas <- mitools::MIextract(models, fun = coef)
  betasPass <- sapply(betas, function(beta) { length(beta) == expLength })

  stats <- data.table(
    TotalCount = length(betas),
    UsedCount = sum(betasPass)
  )
  stats[, UsedRatio := UsedCount / TotalCount]

  vars <- mitools::MIextract(models, fun = vcov)
  varsPass <- sapply(vars, function(var) { ncol(var) == expLength })

  dataAvailable <- TRUE
  if (sum(betasPass) != sum(varsPass)) {
    PrintAlert('Incompatible length of betas and vars', type = 'warning')
    dataAvailable <- FALSE
  } else if (stats$UsedRatio < 0.9) {
    PrintAlert('Stratification too granular', type = 'warning')
    dataAvailable <- FALSE
  }

  if (dataAvailable) {
    t <- mitools::MIcombine(betas[betasPass], vars[varsPass])

    x <- stats::model.matrix(models[[1]]$formula)
    x <- unique(x[, names(betas[betasPass][[1]])])

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
      combinations[, .(Category, Count)],
      PriorProp = InvLogit(est),
      PriorPropLB = InvLogit(lb),
      PriorPropUB = InvLogit(ub)
    )
  } else {
    result <- combinations[, .(
      Category,
      Count,
      PriorProp,
      PriorPropLB = NA_real_,
      PriorPropUB = NA_real_
    )]
  }
  setorder(result, Category)
  result[, ':='(
    PostProp = 1 - PriorProp,
    PostPropLB = 1 - PriorPropUB,
    PostPropUB = 1 - PriorPropLB
  )]

  return(list(
    Stats = stats,
    Result = result
  ))
}
