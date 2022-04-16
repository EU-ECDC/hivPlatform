GetMigrantConfBounds <- function(
  data,
  variables
) {
  data <- droplevels(melt(
    data,
    measure.vars = patterns('^ImpSCtoDiag'),
    variable.name = 'Imp',
    value.name = 'ImpSCtoDiag'
  ))

  # Add stratification variable
  colNames <- intersect(names(variables), colnames(data))
  setorderv(data, colNames)
  ConvertDataTableColumns(data, setNames(rep('character', length(colNames)), colNames))
  data[,
    (colNames) := lapply(colNames, function(colName) {
      x <- get(colName)
      x[is.na(x)] <- 'NA'
      x <- sprintf('%s [%s]', x, variables[colName])
      return(x)
    }),
    .SDcols = colNames
  ]
  data[,
    Combination := paste(.SD, collapse = ', '),
    by = seq_len(nrow(data)),
    .SDcols = colNames
  ]

  # Create binary var 1=Pre Migration Infection i.e ImpSCtoDiag>mig)
  data[, PreMigrInf := as.integer(ImpSCtoDiag > Mig)]
  dataList <- mitools::imputationList(split(data, by = 'Imp'))

  # isFactor <- unlist(lapply(data[, ..variables], is.factor))
  # numLevels <- unlist(lapply(data[, ..variables], nlevels))[isFactor]
  # dropVars <- names(numLevels)[numLevels < 2]
  # if (length(dropVars) > 0) {
  #   variables <- setdiff(variables, dropVars)
  #   PrintAlert(
  #     'The following stratification variables have been dropped due to insufficient number of levels: {.val {dropVars}}' # nolint
  #   )
  # }
  # terms <- ifelse(length(variables) > 0, paste(variables, collapse = ' + '), '1')
  # formula <- as.formula(sprintf('PreMigrInf ~ %s', terms))
  models <- with(dataList, glm(PreMigrInf ~ Combination, family = binomial()))
  # models <- lapply(
  #   dataList$imputations,
  #   function(d) {
  #     glm(formula, family = binomial(), data = d)
  #   }
  # )
  betas <- mitools::MIextract(models, fun = coef)
  vars <- mitools::MIextract(models, fun = vcov)
  res <- mitools::MIcombine(betas, vars)

  x <- unique(stats::model.matrix(models[[1]]))
  est <- as.vector(x %*% res$coefficients)
  bound <- qnorm(0.975) * sqrt(diag(x %*% res$variance %*% t(x)))
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
