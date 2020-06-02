library(hivModelling)
library(hivEstimatesAccuracy2)

# Define count of MI data sets
M <- 2

# Define count of bootstrap data sets
B <- 5

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 2 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs, miCount = M)

# STEP 3 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData(settings = list(Verbose = FALSE))

# STEP 4 - Generate B bootstrapped case-based datasets for each pseudo-complete datasets -----------

appMgr$GenerateBoostrapCaseBasedDataSets(bsCount = B)

# STEP 5 - Fit the model to M x B bootstrapped case-based datasets ---------------------------------

appMgr$FitHIVModelToBootstrapData()

# STEP 6 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()
