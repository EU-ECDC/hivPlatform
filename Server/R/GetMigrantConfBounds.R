GetMigrantConfBounds <- function(
  data,
  variables
) {
  data <- melt(
    data,
    measure.vars = patterns('^ImpSCtoDiag'),
    variable.name = 'Imp',
    value.name = 'ImpSCtoDiag'
  )

  # Add stratification variable
  colNames <- intersect(variables, colnames(data))

  data[, Strata := .GRP, by = colNames]
  data[, PreMigrInf := as.integer(ImpSCtoDiag > Mig)]

  # data <- data[Strata == 2]
  # unique(data[Strata == 1, .(Gender, Transmission)])

  dataList <- mitools::imputationList(split(data, by = 'Imp'))

  models <- with(dataList, glm(PreMigrInf ~ factor(Strata), family = binomial()))
  # models <- with(dataList, glm(PreMigrInf ~ Gender:Transmission, family = binomial()))
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
    x,
    Est = InvLogit(est),
    LB = InvLogit(lb),
    UB = InvLogit(ub)
  )[, -1]

  return(result)
}
