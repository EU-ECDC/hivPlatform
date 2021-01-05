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
aggrDataSelection <- NULL
appMgr$HIVModelMgr$RunMainFit(
  settings = list(), parameters = list(), popCombination, aggrDataSelection
)

# STEP 6 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 50, bsType = 'PARAMETRIC')

# STEP 7 - Explore bootstrap results ---------------------------------------------------------------
# All data sets
hist(appMgr$HIVModelMgr$BootstrapFitStats$RunTime)
table(appMgr$HIVModelMgr$BootstrapFitStats$Converged)

# Successful fits only data sets
appMgr$HIVModelMgr$BootstrapFitStats$Beta
pairs(appMgr$HIVModelMgr$BootstrapFitStats$Beta)
appMgr$HIVModelMgr$BootstrapFitStats$BetaStats

appMgr$HIVModelMgr$BootstrapFitStats$Theta
pairs(appMgr$HIVModelMgr$BootstrapFitStats$Theta)
appMgr$HIVModelMgr$BootstrapFitStats$ThetaStats

appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats$N_HIV_Obs_M
appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats$N_HIVAIDS_M

# # STEP 8 - Generate report -------------------------------------------------------------------------
# appMgr$GenerateReport()
# appMgr$Report <- appMgr$ReportTask$Result
