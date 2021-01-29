library(hivEstimatesAccuracy2)

appMgr <- AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
# appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.xlsx')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$AggrMgr$ReadData(GetSystemFile('TestData', 'test_-_2_populations.zip'))


# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())


# STEP 3 - Adjust case-based data ------------------------------------------------------------------
filters <- list(
  DiagYear = list(
    ApplyInAdjustments = FALSE,
    MinYear =  2000,
    MaxYear =  2014
  ),
  NotifQuarter <- list(
    ApplyInAdjustments = FALSE,
    MinYear = 2000.125,
    MaxYear = 2014.875
  )
)
appMgr$CaseMgr$RunAdjustments(
  GetAdjustmentSpecs(c('Multiple Imputation using Chained Equations - MICE')),
  # GetAdjustmentSpecs(c('Reporting Delays')),
  filters
)


# STEP 4 - Create adjusted case-based data report --------------------------------------------------
appMgr$CreateReport(reportName = 'Main Report')


# STEP 5 - Fit the HIV model -----------------------------------------------------------------------
popCombination <- list(
  Case = list(
    list(Values = c('M', 'IDU'), Variables = c('Gender', 'Transmission'))
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
appMgr$HIVModelMgr$RunMainFit(
  settings = list(), parameters = list(), popCombination, aggrDataSelection
)


# STEP 5 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'NON-PARAMETRIC')


# STEP 6 - Explore bootstrap results ---------------------------------------------------------------
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


# # STEP 7 - Generate report -----------------------------------------------------------------------
# appMgr$GenerateReport()
# appMgr$Report <- appMgr$ReportTask$Result

# Interface codes for case-based populations
# 'M [G], MSM [T]'
# 'M [G], IDU [T]'
# 'MSM [T], REPCOUNTRY [Reg]'
# 'OTHER [Res], REPCOUNTRY [Reg]'
