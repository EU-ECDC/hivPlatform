PostWTest <- function(
  w,
  y,
  z,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  fxCD4Data,
  fxVRData,
  fzData,
  consc,
  consr
) {
  xAIDS[3] <- xAIDS[3] - w

  lambda <- exp(xAIDS %*% betaAIDS)

  # Get the design matrix for CD4
  fxCD4 <- formula(
    YVar ~
    I(DTime + w) * Gender +
      I(DTime + w) * MigrantRegionOfOrigin +
      I(DTime + w) * Transmission +
      I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar - w), knots = c(16, 22))
  )
  xCD4 <- model.matrix(fxCD4, data = fxCD4Data)
  dimCD4 <- dim(xCD4)

  test <- caret::dummyVars(fxCD4, cbind(fxCD4Data, w = w), fullRank = TRUE)
  predict(test, cbind(fxCD4Data, w = w))
  class(test)

  return(fxCD4)


  # # Get the design matrix for VL
  # fxVR <- formula(
  #   YVar ~
  #   I(DTime + w) * Gender +
  #     I(DTime + w) * MigrantRegionOfOrigin +
  #     I(DTime + w) * Transmission +
  #     I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
  #     I(log(DTime + w + 0.013)) * Gender +
  #     I(log(DTime + w + 0.013)) * MigrantRegionOfOrigin +
  #     I(log(DTime + w + 0.013)) * Transmission +
  #     I(log(DTime + w + 0.013)) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
  #     lspline::lspline(I(Calendar - w), knots = c(16, 22))
  # )
  # xVR <- model.matrix(fxVR, data = fxVRData)
  # dimVR <- dim(xVR)

  # # Combine into one design matrix
  # x <- rbind(
  #   cbind(matrix(0, nrow = dimVR[1], ncol = dimCD4[2]), xVR),
  #   cbind(xCD4, matrix(0, nrow = dimCD4[1], ncol = dimVR[2]))
  # )

  # # Formula for the design matrices of the random effects
  # fz <- formula(
  #   YVar ~
  #     -1 + Consc + I((DTime + w) * Consc) + Consr + I((DTime + w) * Consr) +
  #     I(log(DTime + w + 0.013) * Consr)
  # )
  # z <- model.matrix(fz, data = fzData)

  # # Mean and variance of the normal distribution
  # mu <- c(x %*% bFE)
  # var <- z %*% tcrossprod(varCovRE, z) + diag(consr * sigma2[2] + consc * sigma2[1])

  # p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  # return(p)
}

PostW <- function(
  w,
  y,
  z,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  fxCD4Data,
  fxVRData,
  fzData,
  consc,
  consr
) {
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]

  # Formulae used for constructing the appropriate design matrices

  # Get the design matrix for CD4
  fxCD4 <- formula(
    YVar ~
    I(DTime + w) * Gender +
      I(DTime + w) * MigrantRegionOfOrigin +
      I(DTime + w) * Transmission +
      I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar - w), knots = c(16, 22))
  )
  xCD4 <- model.matrix(fxCD4, data = fxCD4Data)
  dimCD4 <- dim(xCD4)

  # Get the design matrix for VL
  fxVR <- formula(
    YVar ~
    I(DTime + w) * Gender +
      I(DTime + w) * MigrantRegionOfOrigin +
      I(DTime + w) * Transmission +
      I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      I(log(DTime + w + 0.013)) * Gender +
      I(log(DTime + w + 0.013)) * MigrantRegionOfOrigin +
      I(log(DTime + w + 0.013)) * Transmission +
      I(log(DTime + w + 0.013)) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar - w), knots = c(16, 22))
  )
  xVR <- model.matrix(fxVR, data = fxVRData)
  dimVR <- dim(xVR)

  # Combine into one design matrix
  x <- rbind(
    cbind(matrix(0, nrow = dimVR[1], ncol = dimCD4[2]), xVR),
    cbind(xCD4, matrix(0, nrow = dimCD4[1], ncol = dimVR[2]))
  )

  # Formula for the design matrices of the random effects
  fz <- formula(
    YVar ~
      -1 + Consc + I((DTime + w) * Consc) + Consr + I((DTime + w) * Consr) +
      I(log(DTime + w + 0.013) * Consr)
  )
  z <- model.matrix(fz, data = fzData)

  # Mean and variance of the normal distribution
  mu <- c(x %*% bFE)
  var <- z %*% tcrossprod(varCovRE, z) + diag(consr * sigma2[2] + consc * sigma2[1])

  p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  return(p)
}

PostWCD4 <- function(
  w,
  y,
  z,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  fxCD4Data,
  fxVRData,
  fzData,
  consc,
  consr
) {
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]

  # Formula for design matrix of fixed effects
  fxCD4 <- formula(
    YVar ~
      I(DTime + w) * Gender +
      I(DTime + w) * MigrantRegionOfOrigin +
      I(DTime + w) * Transmission +
      I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar - w), knots = c(16, 22))
  )
  x <- model.matrix(fxCD4, data = fxCD4Data)

  # Formula for design matrix of random effects
  fz <- formula(YVar ~ -1 + Consc + I(DTime + w))
  z <- model.matrix(fz, data = fzData)

  # Mean and variance of the normal kernel
  mu <- c(x %*% bFE)
  var <- z %*% tcrossprod(varCovRE, z) + sigma2 * diag(length(x[, 1]))

  p <- exp(mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE) - lambda * (w + maxDTime)^kappa)

  return(p)
}

PostWVL <- function(
  w,
  y,
  z,
  xAIDS,
  maxDTime,
  betaAIDS,
  kappa,
  bFE,
  sigma2,
  varCovRE,
  fxCD4Data,
  fxVRData,
  fzData,
  consc,
  consr
) {
  # Design matrix of the time-to-AIDS model
  xAIDS[3] <- xAIDS[3] - w
  lambda <- exp(xAIDS %*% betaAIDS)[1, 1]

  # Formula for design matrices
  fxVR <- formula(
    YVar ~
    I(DTime + w) * Gender +
      I(DTime + w) * MigrantRegionOfOrigin +
      I(DTime + w) * Transmission +
      I(DTime + w) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      I(log(DTime + w + 0.013)) * Gender +
      I(log(DTime + w + 0.013)) * MigrantRegionOfOrigin +
      I(log(DTime + w + 0.013)) * Transmission +
      I(log(DTime + w + 0.013)) * lspline::lspline(I(Age - w), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar - w), knots = c(16, 22))
  )

  x <- model.matrix(fxVR, data = fxVRData)

  # Formula for design matrix of random effects
  fz <- formula(YVar ~ -1 + Consr + I((DTime + w) * Consr) + I(log(DTime + w + 0.013) * Consr))
  z <- model.matrix(fz, data = fzData)

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
