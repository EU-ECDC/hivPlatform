library(hivEstimatesAccuracy2)

appMgr <- AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(GetSystemFile('TestData', 'dummy_miss1.zip'))
appMgr$AggrMgr$ReadData(GetSystemFile('TestData', 'test_NL_-_2_populations.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
appMgr$CaseMgr$RunAdjustments(
  GetAdjustmentSpecs(c('Multiple Imputation using Chained Equations - MICE'))
)

# STEP 5 - Fit the HIV model -----------------------------------------------------------------------

# Interface codes for case-based populations
# 'M [G], MSM [T]'
# 'M [G], IDU [T]'
# 'MSM [T], REPCOUNTRY [Reg]'
# 'OTHER [Res], REPCOUNTRY [Reg]'

popCombination <- list(
  Case = list(
    list(Values = c('M', 'MSM'), Variables = c('Gender', 'Transmission'))
  ),
  Aggr = c('pop_0')
)
aggrDataSelection <- data.table(
  Name = c(
    'Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'
  ),
  Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)
appMgr$HIVModelMgr$CombineData(popCombination, aggrDataSelection)
appMgr$HIVModelMgr$RunMainFit(settings = list(), parameters = list())

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
