library(hivEstimatesAccuracy2)

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 2 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(miCount = 2, adjustmentSpecs)

# STEP 3 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData(settings = list(Verbose = FALSE))

# STEP 4 - Fit the model to M x B pseudo-complete bootstrapped datasets get the estimates ----------

appMgr$FitHIVModelToBootstrapData(bsCount = 5, verbose = FALSE)

# STEP 5 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()

# STEP 6 - Explore ---------------------------------------------------------------------------------

# All data sets
hist(appMgr$HIVBootstrapStatistics$RunTime)
table(appMgr$HIVBootstrapStatistics$Converged)

# Successful fits only data sets
appMgr$HIVBootstrapStatistics$Beta
pairs(appMgr$HIVBootstrapStatistics$Beta)
appMgr$HIVBootstrapStatistics$BetaStats

appMgr$HIVBootstrapStatistics$Theta
pairs(appMgr$HIVBootstrapStatistics$Theta)
appMgr$HIVBootstrapStatistics$ThetaStats

appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIV_Obs_M
appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIVAIDS_M


type <- 'REPCOUNTRY + UNK + OTHER'
distr <- GetOriginDistribution(appMgr$PreProcessedCaseBasedData$Table)
groups = list(
  list(Name = 'EUROPE', Regions = c('CENTEUR', 'EASTEUR', 'EUROPE', 'WESTEUR'))
)
dtMap <- GetOriginGroupingMap(type, distr, groups = groups)
dtList <- ConvertOriginGroupingDtToList(dtMap)
ConvertOriginGroupingListToDt(dtList)

private$Catalogs$PreProcessedCaseBasedData <- ApplyOriginGroupingMap(
  private$Catalogs$PreProcessedCaseBasedData,
  map
)

test <- list(
  list(Name = 'UNK', Regions = c('UNK')),
  list(Name = 'OTHER', Regions = c('ABROAD', 'AUSTNZ')),
  list(Name = 'REPCOUNTRY', Regions = c('REPCOUNTRY'))
)
