library(hivEstimatesAccuracy2)

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$ApplyAttributesMappingToCaseBasedData()
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping(groups = list())

summaryData <- appMgr$GetSummaryData()
summaryDataJson <- jsonlite:::asJSON(summaryData, keep_vec_names = TRUE)

# STEP 2 - Load aggregated dataset -----------------------------------------------------------------
appMgr$ReadAggregatedData('D:/VirtualBox_Shared/HIV test files/Data/test NL - 2 populations.zip')

# STEP 3 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs)
appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result

cat(appMgr$AdjustmentTask$RunLog)
cat(appMgr$AdjustmentTask$HTMLRunLog)

# STEP 4 - Combine case-based and aggregated data --------------------------------------------------

appMgr$CombineData()

# STEP 5 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModel()
appMgr$HIVModelTask$Result
appMgr$HIVModelResults <- appMgr$HIVModelTask$Result

cat(appMgr$HIVModelTask$RunLog)
cat(appMgr$HIVModelTask$HTMLRunLog)

# STEP 6 - Fit the model to M x B pseudo-complete bootstrapped datasets get the estimates ----------

appMgr$FitHIVModelToBootstrapData(bsCount = 5, verbose = FALSE)

# STEP 7 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()

# STEP 8 - Explore ---------------------------------------------------------------------------------

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
