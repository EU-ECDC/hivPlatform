outputCD4VL <- readRDS('../../outputCD4VL.Rds')
params <- GetMigrantParams()
uniqueId <- 209
dt <- outputCD4VL[UniqueId == uniqueId]

# Predetermined status results in a fixed probability
knownPrePost <- dt[Ord == 1, KnownPrePost]
if (knownPrePost %chin% c('Pre', 'Post')) {
  outputCD4VL[UniqueId == uniqueId, ProbPre := fifelse(knownPrePost == 'Pre', 1.0, 0.0)]
  next
}


y <- dt[, .(YVar)]
z <- dt[, .(Consc, CobsTime, Consr, RobsTime, RLogObsTime2, DTime)]
formulaeData <- dt[, .(YVar, Gender, MigrantRegionOfOrigin, Transmission, Age, DTime, Calendar, Consc, Consr)] # nolint
migTime <- dt[Ord == 1, Mig]
w <- migTime
upTime <- dt[Ord == 1, U]
xAIDS <- as.matrix(dt[Ord == 1, .(1, as.integer(Gender == 'M'), Age)])
maxDTime <- dt[, max(DTime)]
fxCD4Data <- formulaeData[Consc == 1]
fxVLData <- formulaeData[Consr == 1]
fzData <- cbind(y, z)
baseCD4DM <- GetBaseCD4DesignMatrix(fxCD4Data)
baseVLDM <- GetBaseVLDesignMatrix(fxVLData)
baseRandEffDM <- GetBaseRandEffDesignMatrix(fzData)
consc <- dt$Consc
consr <- dt$Consr

sigma2 <- params$sigma2
bFE <- params$bFE
varCovRE <- params$varCovRE
func <- VPostW
x <- consc * sigma2[1] + consr * sigma2[2]
err <- diag(x, nrow = length(x))

betaAIDS <- matrix(params$betaAIDS, ncol = 1)
bFE <- matrix(bFE, ncol = 1)
kappa <- params$kappa

PostW(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = betaAIDS,
  kappa = params$kappa,
  bFE = bFE,
  varCovRE = varCovRE,
  baseCD4DM = baseCD4DM,
  fxCD4Data = fxCD4Data,
  baseVLDM = baseVLDM,
  fxVLData = fxVLData,
  baseRandEffDM = baseRandEffDM,
  fzData = fzData,
  err = err
)

PostWCpp(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = betaAIDS,
  kappa = params$kappa,
  bFE = bFE,
  varCovRE = varCovRE,
  baseCD4DM = baseCD4DM,
  fxCD4Data = fxCD4Data,
  baseVLDM = baseVLDM,
  fxVLData = fxVLData,
  baseRandEffDM = baseRandEffDM,
  fzData = fzData,
  err = err
)

PostWCD4(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = matrix(params$betaAIDS, ncol = 1),
  kappa = params$kappa,
  bFE = matrix(bFE, ncol = 1),
  sigma2 = sigma2,
  varCovRE = varCovRE,
  baseCD4DM = baseCD4DM,
  fxCD4Data = fxCD4Data,
  baseVLDM = baseVLDM,
  fxVLData = fxVLData,
  baseRandEffDM = baseRandEffDM,
  fzData = fzData,
  consc = dt$Consc,
  consr = dt$Consr,
  err = err
)

PostWVL(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = matrix(params$betaAIDS, ncol = 1),
  kappa = params$kappa,
  bFE = matrix(bFE, ncol = 1),
  sigma2 = sigma2,
  varCovRE = varCovRE,
  baseCD4DM = baseCD4DM,
  fxCD4Data = fxCD4Data,
  baseVLDM = baseVLDM,
  fxVLData = fxVLData,
  baseRandEffDM = baseRandEffDM,
  fzData = fzData,
  consc = dt$Consc,
  consr = dt$Consr,
  err = err
)




microbenchmark(
  mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE),
  GetLogMVNPdf(y$YVar, mu, sigma = var),
  GetLogMVNPdf2(y$YVar, mu, sigma = var),
  times = 1000
)
