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
  data[, Strata := .GRP, by = strataColNames]
  allColNames <- union('Strata', strataColNames)
  combinations <- data[, .(Count = .N), keyby = eval(union(allColNames, 'Imputation'))]
  combinations <- combinations[, .(Count = mean(Count)), keyby = allColNames]
  combinations[,
    Category := paste(.SD, collapse = ', '),
    by = seq_len(nrow(combinations)),
    .SDcols = strataColNames
  ]

  data <- melt(
    data,
    measure.vars = patterns('^ImpSCtoDiag'),
    variable.name = 'Imp',
    value.name = 'ImpSCtoDiag'
  )
  data[, PreMigrInf := as.integer(ImpSCtoDiag > Mig)]
  dataList <- mitools::imputationList(split(data, by = 'Imp'))

  if (nrow(combinations) > 1) {
    models <- with(dataList, glm(PreMigrInf ~ factor(Strata), family = binomial()))
  } else {
    models <- with(dataList, glm(PreMigrInf ~ 1, family = binomial()))
  }

  betas <- mitools::MIextract(models, fun = coef)
  vars <- mitools::MIextract(models, fun = vcov)
  t <- mitools::MIcombine(betas, vars)

  x <- stats::model.matrix(models[[1]]$formula)
  x <- unique(x[, names(betas[[1]])])

  if (anyNA(t$coefficients)) {
    naCoef <- which(is.na(t$coefficients))
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
  setorder(result, Category)
  result[, ':='(
    PostProp = 1 - PriorProp,
    PostPropLB = 1 - PriorPropUB,
    PostPropUB = 1 - PriorPropLB
  )]

  return(result)
}
