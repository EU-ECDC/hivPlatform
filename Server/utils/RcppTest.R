outputCD4VL <- readRDS('../../outputCD4VL.Rds')
params <- GetMigrantParams()
uniqueId <- 415
dt <- outputCD4VL[UniqueId == uniqueId]

# Predetermined status results in a fixed probability
knownPrePost <- dt[Ord == 1, KnownPrePost]
if (knownPrePost %chin% c('Pre', 'Post')) {
  outputCD4VL[UniqueId == uniqueId, ProbPre := fifelse(knownPrePost == 'Pre', 1.0, 0.0)]
  next
}

w <- 0.9
y <- dt[, .(YVar)]
z <- dt[, .(Consc, CobsTime, Consr, RobsTime, RLogObsTime2, DTime)]
formulaeData <- dt[, .(YVar, Gender, MigrantRegionOfOrigin, Transmission, Age, DTime, Calendar, Consc, Consr)] # nolint
migTime <- dt[Ord == 1, Mig]
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

switch(dt[Ord == 1, Only],
  'Both' = {
    bFE <- params$bFE
    sigma2 <- params$sigma2
    varCovRE <- params$varCovRE
    func <- VPostW
  },
  'CD4 only' = {
    bFE <- params$bFECD4
    sigma2 <- params$sigma2CD4
    varCovRE <- params$varCovRECD4
    func <- VPostWCD4
  },
  'VL only' = {
    bFE <- params$bFEVL
    sigma2 <- params$sigma2VL
    varCovRE <- params$varCovREVL
    func <- VPostWVL
  }
)
err <- diag(dt$Consc * sigma2[1] + dt$Consr * sigma2[2])
diag(dt$Consc * sigma2[1])
diag(dt$Consr * sigma2[2])

betaAIDS <- matrix(params$betaAIDS, ncol = 1)
bFE <- matrix(bFE, ncol = 1)
kappa <- params$kappa


PostW(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = params$betaAIDS,
  kappa = params$kappa,
  bFE = bFE,
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

PostWCD4(
  w = w,
  y = y,
  xAIDS = xAIDS,
  maxDTime = maxDTime,
  betaAIDS = params$betaAIDS,
  kappa = params$kappa,
  bFE = bFE,
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


PostWCpp(
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

GetLogMVNPdf(y$YVar, mu, sigma = var)
mvnfast::dmvn(y$YVar, mu = mu, sigma = var, log = TRUE)
