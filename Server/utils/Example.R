library(hivEstimatesAccuracy2)

appMgr <- AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(GetSystemFile('TestData', 'dummy_miss1.zip'))
appMgr$AggrMgr$ReadData(GetSystemFile('TestData', 'test_NL_-_2_populations.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())
appMgr$CaseMgr$Summary
appMgr$CaseMgr$SummaryJSON

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)
cat(appMgr$CaseMgr$AdjustmentTask$RunLog)

# # STEP 5 - Fit the HIV model -----------------------------------------------------------------------
# appMgr$FitHIVModel()
# appMgr$HIVModelResults <- appMgr$HIVModelTask$Result
# cat(appMgr$HIVModelTask$RunLog)
# cat(appMgr$HIVModelTask$HTMLRunLog)

# # STEP 6 - Run bootstrap to get the confidence bounds estimates ------------------------------------
# appMgr$RunBootstrap(bsCount = 5)
# appMgr$HIVBootstrapModelResults <- appMgr$BootstrapTask$Result
# cat(appMgr$BootstrapTask$RunLog)

# # STEP 7 - Calculate statistics for every output column --------------------------------------------
# appMgr$ComputeHIVBootstrapStatistics()

# # STEP 8 - Explore bootstrap results ---------------------------------------------------------------
# # All data sets
# hist(appMgr$HIVBootstrapStatistics$RunTime)
# table(appMgr$HIVBootstrapStatistics$Converged)

# # Successful fits only data sets
# appMgr$HIVBootstrapStatistics$Beta
# pairs(appMgr$HIVBootstrapStatistics$Beta)
# appMgr$HIVBootstrapStatistics$BetaStats

# appMgr$HIVBootstrapStatistics$Theta
# pairs(appMgr$HIVBootstrapStatistics$Theta)
# appMgr$HIVBootstrapStatistics$ThetaStats

# appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIV_Obs_M
# appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIVAIDS_M

# # STEP 9 - Generate report -------------------------------------------------------------------------
# appMgr$GenerateReport()
# appMgr$Report <- appMgr$ReportTask$Result
