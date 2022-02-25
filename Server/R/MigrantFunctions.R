GetBaseCD4DesignMatrix <- function(
  data
) {
  dm <- model.matrix(
    formula(
      ~
      DTime * Gender +
        DTime * MigrantRegionOfOrigin +
        DTime * Transmission +
        DTime * lspline::lspline(Age, knots = c(25, 35, 45)) +
        lspline::lspline(Calendar, knots = c(16, 22))
    ),
    data = data
  )
  colMapping <- attr(dm, 'assign')

  return(list(
    dm = dm,
    colsDTime = which(colMapping == 1),
    colsGender = which(colMapping == 2),
    colsRegion = which(colMapping == 3),
    colsTrans = which(colMapping == 4),
    colsAge = which(colMapping == 5),
    colsCalendar = which(colMapping == 6),
    colsDTimeGender = which(colMapping == 7),
    colsDTimeRegion = which(colMapping == 8),
    colsDTimeTrans = which(colMapping == 9),
    colsDTimeAge = which(colMapping == 10)
  ))
}

UpdateCD4DesignMatrix <- function(
  b,
  data,
  w
) {
  b$dm[, b$colsDTime] <- data$DTime + w
  b$dm[, b$colsAge] <- lspline::lspline(data$Age - w, knots = c(25, 35, 45))
  b$dm[, b$colsCalendar] <- lspline::lspline(data$Calendar - w, knots = c(16, 22))
  b$dm[, b$colsDTimeGender] <- b$dm[, b$colsDTime] * b$dm[, b$colsGender]
  b$dm[, b$colsDTimeRegion] <- b$dm[, b$colsDTime] * b$dm[, b$colsRegion]
  b$dm[, b$colsDTimeTrans] <- b$dm[, b$colsDTime] * b$dm[, b$colsTrans]
  b$dm[, b$colsDTimeAge] <- b$dm[, b$colsDTime] * b$dm[, b$colsAge]

  return(b$dm)
}

GetBaseVLDesignMatrix <- function(
  data
) {
  dm <- model.matrix(
    formula(
      ~
      DTime * Gender +
        DTime * MigrantRegionOfOrigin +
        DTime * Transmission +
        DTime * lspline::lspline(Age, knots = c(25, 35, 45)) +
        log(DTime) * Gender +
        log(DTime) * MigrantRegionOfOrigin +
        log(DTime) * Transmission +
        log(DTime) * lspline::lspline(Age, knots = c(25, 35, 45)) +
        lspline::lspline(Calendar, knots = c(16, 22))
    ),
    data = data
  )
  colMapping <- attr(dm, 'assign')

  return(list(
    dm = dm,
    colsDTime = which(colMapping == 1),
    colsGender = which(colMapping == 2),
    colsRegion = which(colMapping == 3),
    colsTrans = which(colMapping == 4),
    colsAge = which(colMapping == 5),
    colsLogDTime = which(colMapping == 6),
    colsCalendar = which(colMapping == 7),
    colsDTimeGender = which(colMapping == 8),
    colsDTimeRegion = which(colMapping == 9),
    colsDTimeTrans = which(colMapping == 10),
    colsDTimeAge = which(colMapping == 11),
    colsLogDTimeGender = which(colMapping == 12),
    colsLogDTimeRegion = which(colMapping == 13),
    colsLogDTimeTrans = which(colMapping == 14),
    colsLogDTimeAge = which(colMapping == 15)
  ))
}

UpdateVLDesignMatrix <- function(
  b,
  data,
  w
) {
  b$dm[, b$colsDTime] <- data$DTime + w
  b$dm[, b$colsAge] <- lspline::lspline(data$Age - w, knots = c(25, 35, 45))
  b$dm[, b$colsLogDTime] <- log(data$DTime + w + 0.013)
  b$dm[, b$colsCalendar] <- lspline::lspline(data$Calendar - w, knots = c(16, 22))
  b$dm[, b$colsDTimeGender] <- b$dm[, b$colsDTime] * b$dm[, b$colsGender]
  b$dm[, b$colsDTimeRegion] <- b$dm[, b$colsDTime] * b$dm[, b$colsRegion]
  b$dm[, b$colsDTimeTrans] <- b$dm[, b$colsDTime] * b$dm[, b$colsTrans]
  b$dm[, b$colsDTimeAge] <- b$dm[, b$colsDTime] * b$dm[, b$colsAge]
  b$dm[, b$colsLogDTimeGender] <- b$dm[, b$colsLogDTime] * b$dm[, b$colsGender]
  b$dm[, b$colsLogDTimeRegion] <- b$dm[, b$colsLogDTime] * b$dm[, b$colsRegion]
  b$dm[, b$colsLogDTimeTrans] <- b$dm[, b$colsLogDTime] * b$dm[, b$colsTrans]
  b$dm[, b$colsLogDTimeAge] <- b$dm[, b$colsLogDTime] * b$dm[, b$colsAge]

  return(b$dm)
}

GetBaseRandEffDesignMatrix <- function(data) {
  dm <- model.matrix(
    formula(
     ~
      -1 +
      Consc + I(DTime * Consc) +
      Consr + I(DTime * Consr) + I(log(DTime + 1) * Consr)
    ),
    data = data
  )
  colMapping <- attr(dm, 'assign')

  return(list(
    dm = dm,
    colsConsc = which(colMapping == 1),
    colsDTimeConsc = which(colMapping == 2),
    colsConsr = which(colMapping == 3),
    colsDTimeConsr = which(colMapping == 4),
    colsLogDTimeConsr = which(colMapping == 5)
  ))
}

UpdateRandEffDesignMatrix <- function(
  b,
  data,
  w
) {
  b$dm[, b$colsDTimeConsc] <- (data$DTime + w) * data$Consc
  b$dm[, b$colsDTimeConsr] <- (data$DTime + w) * data$Consr
  b$dm[, b$colsLogDTimeConsr] <- log(data$DTime + w + 0.013) * data$Consr

  return(b$dm)
}

PostW <- function(
  w,
  y,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  baseCD4DM,
  fxCD4Data,
  baseVLDM,
  fxVLData,
  baseRandEffDM,
  fzData,
  consc,
  consr
) {
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]

  xCD4 <- UpdateCD4DesignMatrix(baseCD4DM, fxCD4Data, w)
  xVL <- UpdateVLDesignMatrix(baseVLDM, fxVLData, w)

  # Combine into one design matrix
  dimCD4 <- dim(xCD4)
  dimVL <- dim(xVL)
  x <- rbind(
    cbind(matrix(0, nrow = dimVL[1], ncol = dimCD4[2]), xVL),
    cbind(xCD4, matrix(0, nrow = dimCD4[1], ncol = dimVL[2]))
  )

  z <- UpdateRandEffDesignMatrix(baseRandEffDM, fzData, w)

  # Mean and variance of the normal distribution
  mu <- c(x %*% bFE)
  var <- z %*% tcrossprod(varCovRE, z) + diag(consc * sigma2[1] + consr * sigma2[2])

  p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  return(p)
}

PostWCD4 <- function(
  w,
  y,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  baseCD4DM,
  fxCD4Data,
  baseVLDM,
  fxVLData,
  baseRandEffDM,
  fzData,
  consc,
  consr
) {
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]
  x <- UpdateCD4DesignMatrix(b = baseCD4DM, data = fxCD4Data, w)
  z <- UpdateRandEffDesignMatrix(baseRandEffDM, fzData, w)[, 1:2, drop = FALSE]

  # Mean and variance of the normal kernel
  mu <- c(x %*% bFE)
  var <- z %*% tcrossprod(varCovRE, z) + sigma2 * diag(length(x[, 1]))

  p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  return(p)
}

PostWVL <- function(
  w,
  y,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  baseCD4DM,
  fxCD4Data,
  baseVLDM,
  fxVLData,
  baseRandEffDM,
  fzData,
  consc,
  consr
) {
  # Design matrix of the time-to-AIDS model
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]
  x <- UpdateVLDesignMatrix(baseVLDM, data = fxVLData, w)
  z <- UpdateRandEffDesignMatrix(baseRandEffDM, fzData, w)[, 3:5, drop = FALSE]

  # Mean and variance of the normal kernel
  mu <- c(x %*% bFE)
  var <- z %*% tcrossprod(varCovRE, z) + sigma2 * diag(length(x[, 1]))

  p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  return(p)
}

PostWAIDS <- function(
  w,
  x,
  dTime,
  betaAIDS,
  kappa
) {
  x[3] <- x[3] - w
  lambda <- exp(x %*% betaAIDS)[1, 1]

  p <- exp(log(kappa) + log(lambda) + (kappa - 1) * log(w + dTime) - lambda * (w + dTime)^kappa)
  return(p)
}

# Vectorize the functions as the "integrate" function works with vectorized functions
VPostW <- Vectorize(PostW, vectorize.args = c('w'))
VPostWCD4 <- Vectorize(PostWCD4, vectorize.args = c('w'))
VPostWVL <- Vectorize(PostWVL, vectorize.args = c('w'))
VPostWAIDS <- Vectorize(PostWAIDS, vectorize.args = c('w'))
