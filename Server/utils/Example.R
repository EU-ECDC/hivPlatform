library(hivModelling)
library(hivEstimatesAccuracy2)

M <- 2
B <- 10

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 1 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs, miCount = M)

# STEP 2 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData(
  settings = list(Verbose = FALSE)
)

# STEP 3 - Generate B bootstrapped case-based datasets for each pseudo-complete datasets -----------

appMgr$GenerateBoostrapCaseBasedDataSets(bsCount = B)

# STEP 4 - Fit the model to M x B bootstrapped case-based datasets ---------------------------------

appMgr$FitHIVModelToBootstrapData()

# STEP 5 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()
