library(hivEstimatesAccuracy2)

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData(fileName = 'D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$ReadAggregatedData(fileName = 'D:/VirtualBox_Shared/HIV test files/Data/Test NL.zip')
appMgr$ApplyAttributesMappingToCaseBasedData()
appMgr$PreProcessCaseBasedData()
# appMgr$ApplyOriginGrouping(type = 'REPCOUNTRY + UNK + OTHER')
appMgr$ApplyOriginGrouping(groups = list())
dt <- appMgr$GetSummaryData()
jsonlite:::asJSON(dt, keep_vec_names = TRUE)

# STEP 2 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
  # 'Joint Modelling Multiple Imputation'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs)
appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result

cat(appMgr$AdjustmentTask$RunLog)
cat(appMgr$AdjustmentTask$HTMLRunLog)

availableStrata <- GetAvailableStrata(appMgr$FinalAdjustedCaseBasedData$Table)

# STEP 3 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData()

cat(appMgr$ModelTask$RunLog)
cat(appMgr$ModelTask$HTMLRunLog)

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
