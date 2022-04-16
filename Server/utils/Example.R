Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

appMgr <- hivPlatform::AppManager$new()
# STEP 1 - Load data -------------------------------------------------------------------------------

# nolint start
# appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK_sample200.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE.csv')
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_sample500.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019Manual.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_case_based.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/PLtest.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/Dummy_case_based.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy_miss2.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.xlsx')
# appMgr$CaseMgr$ReadData(filePath = 'D:/VirtualBox_Shared/PLtest.csv')
# appMgr$AggrMgr$ReadData(GetSystemFile('testData', 'test_-_2_populations.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/HEAT_202102_1_no_prevpos_random_id.csv')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL.zip')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL - Copy.zip')
# appMgr$AggrMgr$ReadData(filePath = 'D:/Downloads/Dead.csv')
# appMgr$AggrMgr$ReadData('D:/Downloads/AggregatedData.zip')
# appMgr$AggrMgr$ReadData(fileName = 'D:/VirtualBox_Shared/DATA_PL.ZIP')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_small.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_tiny.csv')
# nolint end

# library(data.table)
# dt <- ReadDataFile('D:/VirtualBox_Shared/BE.csv')
# WriteDataFile(
#   dt[sample(seq_len(nrow(dt)), size = 500, replace = FALSE)],
#   'D:/VirtualBox_Shared/BE_sample500.csv'
# )

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(
  originGroupingPreset = 'REPCOUNTRY + UNK + EASTERN EUROPE + EUROPE-OTHER-NORTH AMERICA + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + OTHER' # nolint
)

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
# adjustmentSpecs$`Reporting Delays`$Parameters$startYear$value <- 2015
# adjustmentSpecs$`Reporting Delays`$Parameters$endYear$value <- 2020
# adjustmentSpecs$`Reporting Delays`$Parameters$endQrt$value <- 3
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

hivPlatform::RunAdjustments(
  data = appMgr$CaseMgr$Data,
  adjustmentSpecs = adjustmentSpecs,
  diagYearRange = NULL,
  notifQuarterRange = NULL,
  seed = NULL
)

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

data <- appMgr$CaseMgr$Data
data[, ':='(
  Excluded = NULL,
  KnownPrePost = NULL
)]
input <- hivPlatform::PrepareMigrantData(data)
output <- hivPlatform::PredictInf(input, GetMigrantParams())
data[
  input$Data$Input,
  ':='(
    Excluded = i.Excluded,
    KnownPrePost = i.KnownPrePost,
    DateOfArrival = i.DateOfArrival
  ),
  on = .(UniqueId)
]
outputStats <- hivPlatform::GetMigrantOutputStats(data)
outputPlots <- hivPlatform::GetMigrantOutputPlots(data)
output[
  data,
  ':='(
    Gender = i.Gender,
    Transmission = i.Transmission,
    Age = i.Age,
    GroupedRegionOfOrigin = i.GroupedRegionOfOrigin
  ),
  on = .(UniqueId)
]

output <- appMgr$CaseMgr$MigrationResult$Output
confBounds <- GetMigrantConfBounds(
  data = copy(output),
  variables = c('Gender' = 'G', 'Transmission' = 'T')
)

output <- copy(appMgr$CaseMgr$MigrationResult$Output)
output <- output[!is.na(ProbPre)]
output[, Gender := as.integer(Gender)]
output[, Transmission := as.integer(Transmission)]
GetMigrantConfBounds(
  data = copy(output),
  variables = c('Gender' = 'G', 'Transmission' = 'T')
)
GetMigrantConfBounds(
  data = copy(output),
  variables = c('Gender')
)
GetMigrantConfBounds(
  data = copy(output),
  variables = c('Transmission')
)
GetMigrantConfBounds(
  data = copy(output[Transmission == 'IDU']),
  variables = c()
)

input <- PrepareMigrantData(copy(appMgr$CaseMgr$Data))
system.time(output <- PredictInf(input))

# STEP 6 - Fit the HIV model -----------------------------------------------------------------------
aggrDataSelection <- data.table(
  Name = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
  Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)
appMgr$HIVModelMgr$SetAggrFilters(aggrDataSelection)

appMgr$HIVModelMgr$SetMigrConnFlag(TRUE)
appMgr$HIVModelMgr$MigrConnFlag
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE)
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

# STEP 8 - Run bootstrap to get the confidence bounds estimates ------------------------------------
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

# STEP 9 - Explore bootstrap results ---------------------------------------------------------------
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


# STEP 10 - Save and load --------------------------------------------------------------------------

saveRDS(appMgr, file = 'D:/_DEPLOYMENT/hivEstimatesAccuracy2/appMgr_large.rds')
appMgr <- readRDS(file = 'D:/_DEPLOYMENT/hivEstimatesAccuracy2/appMgr.rds')


# Migration ----------------------------------------------------------------------------------------
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
    'RecordId', 'Gender', 'Transmission', 'Age', 'MigrantRegionOfOrigin', 'Calendar', 'Art',
    'DateOfArt', 'DateOfHIVDiagnosis', 'DateOfAIDSDiagnosis', 'DateOfArrival', 'DateOfBirth',
    'AtRiskDate', 'U', 'Mig', 'KnownPrePost', 'UniqueId', 'DTime'
  )
)
currentLevels <- levels(baseAIDS$Gender)
newLevels <- c('M', 'F')
levels(baseAIDS$Gender) <- newLevels[match(currentLevels, c('Male', 'Female'))]
baseAIDS[, Ord := rowid(UniqueId)]

baseCD4VL <- reconCD4VL[, 1:27]
isLabelled <- sapply(baseCD4VL, haven::is.labelled)
colNames <- names(isLabelled[isLabelled])
baseCD4VL[, (colNames) := lapply(.SD, haven::as_factor), .SDcols = colNames]
setnames(
  baseCD4VL,
  c(
    'RecordId', 'DateOfExam', 'YVar', 'Indi', 'Gender', 'Transmission', 'Age',
    'MigrantRegionOfOrigin', 'Calendar', 'Art', 'DateOfArt', 'DateOfHIVDiagnosis',
    'DateOfAIDSDiagnosis', 'DateOfArrival', 'DateOfBirth', 'AtRiskDate', 'U', 'Mig', 'KnownPrePost',
    'DTime', 'UniqueId', 'Consc', 'Consr', 'CobsTime', 'RobsTime', 'RLogObsTime2', 'Only'
  )
)
currentLevels <- levels(baseCD4VL$Gender)
newLevels <- c('M', 'F')
levels(baseCD4VL$Gender) <- newLevels[match(currentLevels, c('Male', 'Female'))]
baseCD4VL[, Ord := rowid(UniqueId)]
baseCD4VL[, UniqueId := UniqueId + max(baseAIDS$UniqueId)]
input <- list(
  Data = list(
    AIDS = baseAIDS,
    CD4VL = baseCD4VL
  )
)

test <- PredictInf(input, params = GetMigrantParams())
GetMigrantConfBounds(
  data = copy(table),
  variables = c()
)

data <- copy(test)

recon <- rbind(
  unique(reconAIDS[, .(UniqueId = id, ProbPre)]),
  unique(reconCD4VL[, .(UniqueId = id + max(reconAIDS$id), ProbPre)])
)

compare <- merge(
  recon,
  test,
  by = c('UniqueId'),
  suffix = c('.Recon', '.Test'),
  all = TRUE
)
compare[, Diff := ProbPre.Recon - ProbPre.Test]
compare[abs(Diff) > 1e-3]
compare[is.na(ProbPre.Test)]

# -------------------------------------------------------------------------------------------------
testmi <- data.table::setDT(haven::read_dta('G:/My Drive/Projects/19. PZH/Migrant/Set 2/MIexample.dta'))
setnames(testmi, 'mig', 'Mig')
testmi[, A := factor(sample.int(10, .N, replace = TRUE))]
testmi[, A := as.integer(A)]
testmi[, group := factor(group)]
GetMigrantConfBounds(testmi, variables = c())
GetMigrantConfBounds(testmi, variables = c('group'))
GetMigrantConfBounds(testmi, variables = c('A', 'group'))
test <- GetMigrantConfBounds(testmi, variables = c('A'))
test[, -1]
writeLines(ConvertObjToJSON(test[, -1], dataframe = 'rows'), 'file.json')

dt <- test[, -1]
json <- ConvertObjToJSON(test[, -1], asMatrix = TRUE)
writeLines(json, 'file.json')

test <- list(
  Gender = TRUE,
  Transmission = FALSE,
  Age = FALSE,
  Migration = FALSE
)
names(test)[unlist(test)]
