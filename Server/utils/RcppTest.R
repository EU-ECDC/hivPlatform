PostW(
  w = 0.9,
  y = y,
  z = z,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = matrix(params$betaAIDS, ncol = 1),
  kappa = params$kappa,
  bFE = bFE,
  sigma2 = sigma2,
  varCovRE = varCovRE,
  fxCD4Data = formulaeData[Consc == 1],
  fxVRData = formulaeData[Consr == 1],
  fzData = cbind(y, z),
  consc = dt$Consc,
  consr = dt$Consr
)
VPostW(
  w = c(0.9, 1),
  y = y,
  z = z,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = matrix(params$betaAIDS, ncol = 1),
  kappa = params$kappa,
  bFE = bFE,
  sigma2 = sigma2,
  varCovRE = varCovRE,
  fxCD4Data = formulaeData[Consc == 1],
  fxVRData = formulaeData[Consr == 1],
  fzData = cbind(y, z),
  consc = dt$Consc,
  consr = dt$Consr
)

ls(environment(test))
get('w', envir = environment(test))

PostWCpp(
  w = 0.9,
  y = y,
  z = z,
  xAIDS = xAIDS,
  maxDTime = 1,
  betaAIDS = matrix(params$betaAIDS, ncol = 1),
  kappa = 1,
  bFE = 1,
  sigma2 = 1,
  varCovRE = 1,
  fxCD4Data = 1,
  fxVRData = 1,
  fzData = 1,
  consc = 1,
  consr = 1
)


dm <- model.matrix(
  formula(
    ~
    DTime +
      Gender +
      MigrantRegionOfOrigin +
      Transmission +
      lspline::lspline(I(Age), knots = c(25, 35, 45)) +
      lspline::lspline(I(Calendar), knots = c(16, 22))
  ),
  data = fxCD4Data
)
colMapping <- attr(dm, 'assign')
termDTime <- which(colMapping == 1) # I(DTime)
termGender <- which(colMapping == 2) # Gender
termRegion <- which(colMapping == 3) # MigrantRegionOfOrigin
termTrans <- which(colMapping == 4) # Transmission
termAge <- which(colMapping == 5) # lspline::lspline(I(Age), knots = c(25, 35, 45))
termCalendar <- which(colMapping == 6) # lspline::lspline(I(Calendar), knots = c(16, 22))

UpdateCD4DesignMatrix <- function(
  dm,
  termDTime,
  termGender,
  termRegion,
  termTrans,
  termAge,
  termCalendar,
  fxCD4Data,
  w
) {
  dm[, termDTime] <- fxCD4Data$DTime + w
  dm[, termAge] <- lspline::lspline(fxCD4Data$Age - w, knots = c(25, 35, 45))
  dm[, termCalendar] <- lspline::lspline(fxCD4Data$Calendar - w, knots = c(16, 22))

  dm <- cbind(
    dm,
    dm[, termDTime] * dm[, termGender],
    dm[, termDTime] * dm[, termRegion],
    dm[, termDTime] * dm[, termTrans],
    dm[, termDTime] * dm[, termAge]
  )

  return(dm)
}

UpdateCD4DesignMatrix(
  dm,
  termDTime,
  termGender,
  termRegion,
  termTrans,
  termAge,
  termCalendar,
  fxCD4Data,
  w
)
