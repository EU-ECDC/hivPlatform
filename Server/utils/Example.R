Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

appMgr <- hivPlatform::AppManager$new()
# STEP 1 - Load data -------------------------------------------------------------------------------

# nolint start
# appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
# appMgr$CaseMgr$ReadData(filePath = 'D:/Downloads/dummy2019Manual.csv')
# appMgr$CaseMgr$ReadData('D:/_DEPLOYMENT/hivEstimatesAccuracy/PL2019.xlsx')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK_sample200.csv')
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_sample500.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019Manual.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_case_based.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/PLtest.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/Dummy_case_based.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy_miss2.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy2019_exclUK.xlsx')
# appMgr$CaseMgr$ReadData(filePath = 'D:/VirtualBox_Shared/PLtest.csv')
# appMgr$AggrMgr$ReadData(GetSystemFile('testData', 'test_-_2_populations.zip'))
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/HEAT_202102_1_no_prevpos_random_id.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_small.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE_tiny.csv')
# appMgr$CaseMgr$ReadData('G:/My Drive/Projects/19. PZH/Bugs/2022.06.04 - RD/HEAT_202105_1_no_prevpos_random_id.csv')
# appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/BE.csv')
# appMgr$CaseMgr$ReadData('G:/My Drive/Projects/19. PZH/Bugs/2022.06.13 - RD/HEAT_202205_1_no_prevpos_random_id.csv')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL.zip')
# appMgr$AggrMgr$ReadData('D:/VirtualBox_Shared/HIV test files/Data/Test NL - Copy.zip')
# appMgr$AggrMgr$ReadData(filePath = 'D:/Downloads/Dead.csv')
# appMgr$AggrMgr$ReadData('D:/Downloads/AggregatedData.zip')
# appMgr$AggrMgr$ReadData(fileName = 'D:/VirtualBox_Shared/DATA_PL.ZIP')
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
# adjustmentSpecs <-
#   hivPlatform::GetAdjustmentSpecs(c("Multiple Imputation using Chained Equations - MICE"))
# adjustmentSpecs[[1]]$Parameters$nimp$value <- 20
# adjustmentSpecs[[1]]$Parameters$nit$value <- 20
adjustmentSpecs <- GetAdjustmentSpecs(c('Reporting Delays with trend'))
adjustmentSpecs$`Reporting Delays with trend`$Parameters$startYear$value <- 1980
adjustmentSpecs$`Reporting Delays with trend`$Parameters$endYear$value <- 2021
adjustmentSpecs$`Reporting Delays with trend`$Parameters$endQrt$value <- 2

data <- appMgr$CaseMgr$Data

# adjustmentSpecs <- hivPlatform::GetAdjustmentSpecs(c('Multiple Imputation using Chained Equations - MICE'))
# adjName <- 'Reporting Delays with trend'
# adjustmentSpecs <- GetAdjustmentSpecs(adjName)
# adjustmentSpecs[[adjName]]$Parameters$startYear$value <- 1980
# adjustmentSpecs[[adjName]]$Parameters$endYear$value <- 2022
# adjustmentSpecs[[adjName]]$Parameters$endQrt$value <- 1
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

appMgr$CaseMgr$AdjustmentResult

q2 <- appMgr$CaseMgr$AdjustmentResult[[1]]$Artifacts$RdDistribution
q1 <- appMgr$CaseMgr$AdjustmentResult[[1]]$Artifacts$RdDistribution

data <- copy(appMgr$CaseMgr$PreProcessedData)

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
appMgr$CaseMgr$MigrationResult$Artifacts$InputStats
appMgr$CaseMgr$MigrationResult$Artifacts$OutputStats$TableDistr
json <- ConvertObjToJSON(appMgr$CaseMgr$MigrationResult$Artifacts$OutputPlots, dataframe = 'columns')
writeLines(json, 'json.txt')
appMgr$CaseMgr$MigrationResult$Artifacts$ConfBounds

params <- GetMigrantParams()
data <- copy(appMgr$CaseMgr$Data)
input <- hivPlatform::PrepareMigrantData(data)
output <- hivPlatform::PredictInf(input, params)
output.copy <- copy(output)
output <- copy(output.copy)

data[output, ProbPre := i.ProbPre, on = .(UniqueId)]
data[
  input$Data$Input,
  ':='(
    Excluded = i.Excluded,
    KnownPrePost = i.KnownPrePost,
    DateOfArrival = i.DateOfArrival
  ),
  on = .(UniqueId)
]

output[
  data,
  ':='(
    Imputation = i.Imputation,
    YearOfArrival = year(i.DateOfArrival),
    YearOfHIVDiagnosis = i.YearOfHIVDiagnosis,
    MigrantRegionOfOrigin = i.MigrantRegionOfOrigin,
    Gender = i.Gender,
    Transmission = i.Transmission,
    Age = i.Age,
    GroupedRegionOfOrigin = i.GroupedRegionOfOrigin
  ),
  on = .(UniqueId)
]
output[, ':='(
  Total = 'Total',
  AgeGroup = cut(
    Age,
    breaks = c(-Inf, 25, 40, 55, Inf),
    labels = c('< 25', '25 - 39', '40 - 54', '55+'),
    right = FALSE
  )
)]
output[
  MigrantRegionOfOrigin == 'CARIBBEAN-LATIN AMERICA',
  MigrantRegionOfOrigin := 'OTHER'
]

outputPlots <- hivPlatform::GetMigrantOutputPlots(data = copy(output))
outputStats <- hivPlatform::GetMigrantOutputStats(data = output)
confBounds <- GetMigrantConfBounds(
  data = output,
  strat = c('AgeGroup'),
  region = 'ALL'
)
json <- lapply(outputPlots, ConvertObjToJSON, dataframe = 'cols')
json <- ConvertObjToJSON(outputPlots, dataframe = 'columns')
writeLines(json, 'json.txt')


data <- copy(output)
data[, Year := factor(year(DateOfArrival))]
test <- GetMigrantConfBounds(
  data,
  strat = c('YearOfHIVDiagnosis'),
  region = 'ALL'
)


# STEP 6 - Fit the HIV model -----------------------------------------------------------------------
parameters <- list(
  ModelMinYear = 1980,
  ModelMaxYear = 2016,
  FitPosMinYear = 1979,
  FitPosMaxYear = 1979,
  FitPosCD4MinYear = 1984,
  FitPosCD4MaxYear = 2016,
  FitAIDSPosMinYear = 1996,
  FitAIDSPosMaxYear = 2016,
  FitAIDSMinYear = 1984,
  FitAIDSMaxYear = 1995,
  FullData = FALSE,
  ModelNoKnots = 6,
  StartIncZero = TRUE,
  MaxIncCorr = TRUE,
  FitDistribution = 'NEGATIVE_BINOMIAL',
  Delta4Fac = 0,
  Country = 'NL',
  Intervals = data.table(
    StartYear = c(1980, 1984, 1996, 2000, 2005, 2010),
    EndYear = c(1984, 1996, 2000, 2005, 2010, 2016),
    Jump = c(FALSE, TRUE, FALSE, FALSE, FALSE, FALSE),
    DiffByCD4 = c(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
    ChangeInInterval = c(FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)
  )
)
caseData <- NULL
aggrData <- appMgr$AggrMgr$Data
aggrDataSelection <- NULL
migrConnFlag <- FALSE

appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = parameters,
  popCombination = list(Case = NULL, Aggr = appMgr$AggrMgr$PopulationNames)
)
appMgr$HIVModelMgr$PlotData
appMgr$HIVModelMgr$MainFitResult[[1]]$Results$MainOutputs
names(appMgr$HIVModelMgr$MainFitResult[[1]]$Results)

caseData <- appMgr$CaseMgr$Data
aggrData <- appMgr$AggrMgr$Data
settings <- list()
parameters <- list()
popCombination <- list()
aggrDataSelection <- appMgr$HIVModelMgr$AggrDataSelection
appMgr$HIVModelMgr$SetMigrConnFlag(TRUE)
migrConnFlag <- appMgr$HIVModelMgr$MigrConnFlag
randomSeed <- .Random.seed


json <- ConvertObjToJSON(appMgr$HIVModelMgr$PlotData, dataframe = 'columns')
writeLines(json, 'json.txt')

aggrDataSelection <- data.table(
  Name = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
  Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)
appMgr$HIVModelMgr$SetAggrFilters(aggrDataSelection)

# popCombination <- list(
#   Case = NULL,
#   Aggr = appMgr$AggrMgr$PopulationNames
# )
# appMgr$HIVModelMgr$RunMainFit(
#   settings = list(Verbose = FALSE),
#   popCombination = list(Case = NULL, Aggr = NULL)
# )

# 1. Detailed HIV Model main fit results
hivModels <- appMgr$HIVModelMgr$MainFitResult
hivModel <- hivModels[[1]]
hivModel$Results$MainOutputs
hivModel$Results$ModelResults

# Average betas
betas <- as.data.table(lapply(hivModels, function(model) {
  model$Results$Param$Beta
}))
betas[, Avg := rowMeans(betas)]

# Average incidence curve

numPoints <- 5000
years <- seq(
  hivModel$Results$Info$ModelMinYear,
  hivModel$Results$Info$ModelMaxYear,
  length.out = numPoints
)
incidenceCurves <- as.data.table(lapply(
  hivModels,
  function(hivModel) {
    sapply(
      years,
      hivModelling:::GetBSpline,
      theta = hivModel$Results$Param$Theta,
      kOrder = hivModel$Results$Info$SplineOrder,
      modelSplineN = hivModel$Results$Info$ModelSplineN,
      myKnots = hivModel$Results$Info$MyKnots,
      minYear = hivModel$Results$Info$ModelMinYear,
      maxYear = hivModel$Results$Info$ModelMaxYear
    )
  }
))
incidenceCurves[, Avg := rowMeans(.SD)]
matplot(years, incidenceCurves, type = c('l'), pch = 1, col = 1:6)
legend('topleft', legend = 1:6, pch = 1, col = 1:6)

# Average model
avgModel <- hivModelling::FitModel(
  beta = betas$Avg,
  theta = rep(0, length(hivModel$Results$Param$Theta)),
  context = hivModel$Context,
  data = hivModel$PopData,
  preCompBSpline = as.matrix(incidenceCurves[, .(years, Avg)])
)
avgModelOutputs <- hivModelling::GetModelOutputs(avgModel, hivModel$PopData)
avgPlots <- hivModelling::CreateOutputPlots(avgModelOutputs)

test <- avgModelOutputs$MainOutputs[, .(Year, N_Inf_M)]
test[, Avg_N_Inf_M := approx(years, incidenceCurves$Avg, test$Year)$y]




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
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 100, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 2, bsType = 'NON-PARAMETRIC')

fits <- appMgr$HIVModelMgr$BootstrapFitResult

avgRunTime <- mean(sapply(appMgr$HIVModelMgr$MainFitResult, '[[', 'RunTime'))
maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')
prettyunits::pretty_dt(maxRunTime)
mainFitResult <- isolate(appMgr$HIVModelMgr$MainFitResult)
caseData <- isolate(appMgr$CaseMgr$Data)
aggrData <- isolate(appMgr$AggrMgr$Data)
popCombination <- isolate(appMgr$HIVModelMgr$PopCombination)
aggrDataSelection <- isolate(appMgr$HIVModelMgr$AggrDataSelection)
randomSeed <- .Random.seed

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

# Recon data set
reconAIDS <- data.table::setDT(haven::read_dta('D:/VirtualBox_Shared/Migrant_test/baseAIDS.dta'))
reconCD4VL <- data.table::setDT(haven::read_dta('D:/VirtualBox_Shared/Migrant_test/baseCD4VL.dta'))

# Create inputs for testing
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

# Create test dataset
test <- PredictInf(input, params)

# Reconcile
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

# Show differences
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
