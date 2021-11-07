Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

appMgr <- hivPlatform::AppManager$new()
# STEP 1 - Load data -------------------------------------------------------------------------------

# nolint start
# appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
# appMgr$CaseMgr$ReadData('D:/_DEPLOYMENT/hivEstimatesAccuracy/PL2019.xlsx')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.xlsx')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData(filePath = 'D:/VirtualBox_Shared/PLtest.csv')
# appMgr$AggrMgr$ReadData(GetSystemFile('testData', 'test_-_2_populations.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/HEAT_202102_1_no_prevpos_random_id.csv')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL.zip')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL - Copy.zip')
# appMgr$AggrMgr$ReadData(fileName = 'D:/VirtualBox_Shared/DATA_PL.ZIP')
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_small.csv')
# nolint end


# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGroupingType = 'EUROPE + AFRICA + ASIA + UNK + OTHER')


appMgr$CaseMgr$SetFilters(filters = list(
  DiagYear = list(
    ApplyInAdjustments = TRUE,
    MinYear =  1980,
    MaxYear =  2019
  ),
  NotifQuarter <- list(
    ApplyInAdjustments = FALSE,
    MinYear = 1995.375,
    MaxYear = 2020.375
  )
))

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <-
  hivPlatform::GetAdjustmentSpecs(c('Multiple Imputation using Chained Equations - MICE'))
# adjustmentSpecs <- GetAdjustmentSpecs(c('Reporting Delays with trend')) # nolint
adjustmentSpecs$`Reporting Delays`$Parameters$startYear$value <- 2015
adjustmentSpecs$`Reporting Delays`$Parameters$endYear$value <- 2020
adjustmentSpecs$`Reporting Delays`$Parameters$endQrt$value <- 2
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

# saveRDS(appMgr$CaseMgr$Data, 'D:/VirtualBox_Shared/BE_adjusted.rds') # nolint

# STEP 4 - Create adjusted case-based data report --------------------------------------------------
appMgr$CreateReport(
  reportSpec = list(
    name = 'Main Report',
    reportingDelay = TRUE,
    smoothing = FALSE,
    cd4ConfInt = FALSE
  )
)

fileName <- RenderReportToFile(
  reportFilePath = GetReportFileNames()['Main Report'],
  format = 'pdf_document',
  params = appMgr$ReportArtifacts
)
browseURL(fileName)

# STEP 5 - Migration -------------------------------------------------------------------------------
appMgr$CaseMgr$RunMigration()
params <- hivPlatform::GetMigrantParams()
migrantData <- hivPlatform::PrepareMigrantData(data = appMgr$CaseMgr$Data)
result <- hivPlatform::PredictInf(migrantData$Data, params)
# result <- hivPlatform::PredictInf(list(AIDS = NULL, CD4VL = NULL), params)
report <- RenderReportToHTML(
  reportFilePath = GetSystemFile('reports', 'intermediate', '3.Migrant.Rmd'),
  params = migrantData$Stats
)

# STEP 6 - Fit the HIV model -----------------------------------------------------------------------
aggrDataSelection <- data.table(
  Name = c(
    'Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'
  ),
  Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)
appMgr$HIVModelMgr$SetAggrFilters(aggrDataSelection)

appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = test$params,
  popCombination = test$popCombination
)

popCombination <- list(
  Case = NULL,
  Aggr = appMgr$AggrMgr$PopulationNames
)
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  popCombination = popCombination
)

# 1. Detailed HIV Model main fit results (rds)
names(appMgr$HIVModelMgr$MainFitResult$`0`$Results$MainOutputs)

# 2. Main outputs (txt, rds, stata)
data <- rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  setcolorder(dt, 'Imputation')
}))

# STEP 7 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'NON-PARAMETRIC')

# 3. Detailed HIV Model bootstrap results (rds)
appMgr$HIVModelMgr$BootstrapFitResult

# 4. Main outputs of bootstrap (txt, rds, stata)
succFlatList <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult)
)
mainOutputs <- rbindlist(lapply(succFlatList, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$DataSet,
    BootIteration = res$BootIteration
  )]
  return(mainOutputs)
}))
setcolorder(
  mainOutputs,
  c('DataSet', 'BootIteration')
)

# 5. Detailed bootstrap statistics (rds)
appMgr$HIVModelMgr$BootstrapFitStats

# 6. Main output stats (rds)
bootstrap <- rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)


# STEP 8 - Explore bootstrap results ---------------------------------------------------------------
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


# STEP 7 - Save and load ---------------------------------------------------------------------------

saveRDS(appMgr, file = 'D:/_DEPLOYMENT/hivEstimatesAccuracy2/appMgr.rds')
appMgr <- readRDS(file = 'D:/_DEPLOYMENT/hivEstimatesAccuracy2/appMgr.rds')


data <- appMgr$CaseMgr$PreProcessedData
cat(appMgr$CaseMgr$AdjustmentTask$RunLog)
cat(appMgr$CaseMgr$AdjustmentTask$HTMLRunLog)

test <- readRDS(file = 'D:/Downloads/HIVPlatformState_20210516_201741.rds')
cat(test$UIState)

caseData <- appMgr$CaseMgr$Data
aggrData <- appMgr$AggrMgr$Data
popCombination <- list(
  Case = NULL,
  Aggr = 'pop_0'
)
aggrDataSelection <- data.table(
  Name = c(
    'AIDS'
  ),
  Use = c(TRUE),
  MinYear = c(1995),
  MaxYear = c(2005)
)
CombineData(caseData, aggrData, popCombination, aggrDataSelection)

# Migration
params <- GetMigrantParams()

# Reconciliations
reconAIDS <- data.table::setDT(haven::read_dta('D:/VirtualBox_Shared/Migrant_test/baseAIDS.dta'))
reconCD4VL <- data.table::setDT(haven::read_dta('D:/VirtualBox_Shared/Migrant_test/baseCD4VL.dta'))

baseAIDS <- reconAIDS[, 1:18]
isLabelled <- sapply(baseAIDS, haven::is.labelled)
colNames <- names(isLabelled[isLabelled])
baseAIDS[, (colNames) := lapply(.SD, haven::as_factor), .SDcols = colNames]
setnames(
  baseAIDS,
  c(
    'RecordId', 'Gender', 'Mode', 'Age', 'GroupedRegion', 'Calendar', 'Art', 'DateOfArt',
    'DateOfHIVDiagnosis', 'DateOfAIDSDiagnosis', 'DateOfArrival', 'DateOfBirth', 'AtRiskDate',
    'U', 'Mig', 'KnownPrePost', 'UniqueId', 'DTime'
  )
)
currentLevels <- levels(baseAIDS$Gender)
newLevels <- c('M', 'F')
levels(baseAIDS$Gender) <- newLevels[match(currentLevels, c('Male', 'Female'))]
baseAIDS[, Ord := rowid(RecordId)]
baseAIDS[, Imputation := 0L]
baseAIDS[, RecordId := as.character(RecordId)]

baseCD4VL <- reconCD4VL[, 1:27]
isLabelled <- sapply(baseCD4VL, haven::is.labelled)
colNames <- names(isLabelled[isLabelled])
baseCD4VL[, (colNames) := lapply(.SD, haven::as_factor), .SDcols = colNames]
setnames(
  baseCD4VL,
  c(
    'RecordId', 'DateOfExam', 'YVar', 'Indi', 'Gender', 'Mode', 'Age', 'GroupedRegion',
    'Calendar', 'Art', 'DateOfArt', 'DateOfHIVDiagnosis', 'DateOfAIDSDiagnosis', 'DateOfArrival',
    'DateOfBirth', 'AtRiskDate', 'U', 'Mig', 'KnownPrePost', 'DTime', 'UniqueId', 'Consc', 'Consr',
    'CobsTime', 'RobsTime', 'RLogObsTime2', 'Only'
  )
)
currentLevels <- levels(baseCD4VL$Gender)
newLevels <- c('M', 'F')
levels(baseCD4VL$Gender) <- newLevels[match(currentLevels, c('Male', 'Female'))]
baseCD4VL[, Ord := rowid(RecordId)]
baseCD4VL[, Imputation := 0L]
baseCD4VL[, RecordId := as.character(RecordId)]

input <- list(
  AIDS = baseAIDS,
  CD4VL = baseCD4VL
)

test <- PredictInf(input, params)
recon <- rbind(
  unique(reconAIDS[, .(Imputation = 0L, RecordId = as.character(PATIENT), ProbPre)]),
  unique(reconCD4VL[1:10, .(Imputation = 0L, RecordId = as.character(PATIENT), ProbPre)])
)

compare <- merge(
  recon,
  test,
  by = c('Imputation', 'RecordId'),
  suffix = c('.Recon', '.Test'),
  all = TRUE
)
compare[, Diff := ProbPre.Recon - ProbPre.Test]
compare[abs(Diff) > 1e-7]
