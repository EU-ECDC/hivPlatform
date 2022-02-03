Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

appMgr <- hivPlatform::AppManager$new()
# STEP 1 - Load data -------------------------------------------------------------------------------

# nolint start
# appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
# appMgr$CaseMgr$ReadData('D:/_DEPLOYMENT/hivEstimatesAccuracy/PL2019.xlsx')
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.xlsx')
# appMgr$CaseMgr$ReadData(filePath = 'D:/VirtualBox_Shared/PLtest.csv')
# appMgr$AggrMgr$ReadData(GetSystemFile('testData', 'test_-_2_populations.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/HEAT_202102_1_no_prevpos_random_id.csv')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL.zip')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL - Copy.zip')
# appMgr$AggrMgr$ReadData(fileName = 'D:/VirtualBox_Shared/DATA_PL.ZIP')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_small.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_tiny.csv')
# nolint end


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

# 1. Perform migration
appMgr$CaseMgr$RunMigration()
appMgr$HIVModelMgr$MigrConnFlag
data <- copy(appMgr$CaseMgr$Data)
data[!is.na(Excluded), unique(ProbPre)]
data[is.na(Excluded) & KnownPrePost == 'Pre', unique(ProbPre)]
data[is.na(Excluded) & KnownPrePost == 'Post', unique(ProbPre)]

# 2. Classify each case in the case based data
data[, MigrClass := fcase(
  !is.na(DateOfHIVDiagnosis) & !is.na(DateOfArrival) & DateOfHIVDiagnosis < DateOfArrival, 'Diagnosed prior to arrival', # nolint
  !is.na(ProbPre) & ProbPre >= 0.5, 'Infected in the country of origin',
  !is.na(ProbPre) & ProbPre < 0.5, 'Infected in the country of destination',
  default = 'Not considered migrant'
)]

# 3.	Modelling flow (for population = All):

# a. Prepare the Dead file based on the whole dataset
if (!('Weight' %in% colnames(data))) {
  data[, Weight := 1]
}
dead <- data[!is.na(DateOfDeath), .(Count = sum(Weight)), keyby = .(Year = year(DateOfDeath))]

# b. Exclude cases classified as b. or c. (in 2.)
# c. Prepare input datasets (HIV, HIVAIDS, HIV_CD4_XX, AIDS) as usual based on the subset data
hivData <- PrepareDataSetsForModel(data[
  !is.na(MigrClass) &
    MigrClass != 'Diagnosed prior to arrival' &
    MigrClass != 'Infected in the country of origin'
])
hivData[['Dead']] <- dead

# d. Run model
context <- hivModelling::GetRunContext(
  data = hivData,
  settings = list(),
  parameters = list()
)
popData <- hivModelling::GetPopulationData(context)
fitResults <- hivModelling::PerformMainFit(
  context,
  popData,
  attemptSimplify = TRUE,
  verbose = TRUE
)

# e. Estimate New_infections, Cumulative_new_infections, New_diagnoses
fitResults$MainOutputs

# 4. Prepare data for pre-migration infected cases

# a. Take cases classified as b. or c. (in 2.)
preMigrantData <- data[
  !is.na(MigrClass) & !is.na(DateOfArrival) &
    (MigrClass == 'Diagnosed prior to arrival' | MigrClass == 'Infected in the country of origin')
]

# b. Summarize by Year of Arrival (let’s call them New_migrant_cases),
#    create yearly Cumulative_New_migrant_cases)
newMigrantData <- preMigrantData[,
  .(NewMigrantCases = sum(Weight)),
  keyby = .(YearOfArrival = year(DateOfArrival))
]
newMigrantData[, CumNewMigrantCases := cumsum(NewMigrantCases)]

# c. Summarize cases diagnosed prior to arrival (b.) by year of arrival and cases diagnosed after
# arrival (c.) by Year of diagnosis  , add these two columns (call the sum New_migrant_diagnoses),
# create yearly cumulative count Cumulative_newe_migrant_diagnoses
newMigrantData2 <- preMigrantData[,
  .(NewMigrantCases = sum(Weight)),
  keyby = .(
    MigrClass,
    YearOfArrival = year(DateOfArrival)
  )
]
newMigrantData2[, CumNewMigrantCases := cumsum(NewMigrantCases)]

newMigrantData3 <- preMigrantData[,
  .(NewMigrantCases = sum(Weight)),
  keyby = .(
    MigrClass,
    YearOfDiagnosis = year(DateOfHIVDiagnosis)
  )
]
newMigrantData3[, CumNewMigrantCases := cumsum(NewMigrantCases)]


# STEP 6 - Modelling - Migration Coonection --------------------------------------------------------



# STEP 7 - Fit the HIV model -----------------------------------------------------------------------
aggrDataSelection <- data.table(
  Name = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
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

saveRDS(appMgr, file = 'D:/_DEPLOYMENT/hivEstimatesAccuracy2/appMgr.rds')
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
    'RecordId', 'Gender', 'Mode', 'Age', 'GroupedRegionOfOrigin', 'Calendar', 'Art', 'DateOfArt',
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
    'RecordId', 'DateOfExam', 'YVar', 'Indi', 'Gender', 'Mode', 'Age', 'GroupedRegionOfOrigin',
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

baseCD4VL$Gender
baseCD4VL$Mode
baseCD4VL$GroupedRegionOfOrigin
input <- list(
  AIDS = baseAIDS[1:10],
  CD4VL = baseCD4VL[1:10]
)

test <- PredictInf(input, params)
recon <- rbind(
  unique(reconAIDS[1:10, .(Imputation = 0L, RecordId = as.character(PATIENT), ProbPre)]),
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

unique(data$AcuteInfection)
class(data$AcuteInfection)
data[Transmission %in% c('MSM', 'IDU', 'HETERO', NA_character_), unique(Transmission)]
data[, unique(Transmission)]

unique(appMgr$CaseMgr$Data$Transmission)
