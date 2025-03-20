Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

## A. Case-based data only =========================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())
# Optional
appMgr$CaseMgr$SetFilters(filters = list(
  DiagYear = list(
    ApplyInAdjustments = TRUE,
    MinYear = 1980,
    MaxYear = 2019
  ),
  NotifQuarter = list(
    ApplyInAdjustments = FALSE,
    MinYear = 1995.375,
    MaxYear = 2020.375
  )
))

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- hivPlatform::GetAdjustmentSpecs(
  c('Multiple Imputation using Chained Equations - MICE')
)
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

# STEP 4 - Create adjusted case-based data report --------------------------------------------------
appMgr$CreateReport(
  reportSpec = list(
    name = 'Main Report',
    reportingDelay = FALSE,
    smoothing = FALSE,
    cd4ConfInt = FALSE
  )
)

reportFileName <- hivPlatform::RenderReportToFile(
  reportFilePath = hivPlatform::GetReportFileNames()['Main Report'],
  format = 'pdf_document',
  params = appMgr$ReportArtifacts
)
browseURL(reportFileName)

# STEP 5 - Fit the HIV model to the case-based data ------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  popCombination = list(
    Case = NULL, # No filter = all data
    Aggr = c()
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 3 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'NON-PARAMETRIC')

# Bootstrap data
data <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult)
)
data <- data.table::rbindlist(lapply(data, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$DataSet,
    BootIteration = res$BootIteration
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  data,
  c('DataSet', 'BootIteration')
)

# Bootstrap stats
data <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)


## B. Aggregated data only =========================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$AggrMgr$ReadData(hivPlatform::GetSystemFile('testData', 'test_-_2_populations.zip'))

# STEP 2 - Fit the HIV model -----------------------------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  popCombination = list(
    Case = NULL,
    Aggr = appMgr$AggrMgr$PopulationNames
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 3 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')

# Bootstrap data
data <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult)
)
data <- data.table::rbindlist(lapply(data, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$DataSet,
    BootIteration = res$BootIteration
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  data,
  c('DataSet', 'BootIteration')
)

# Bootstrap stats
data <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)


## C. Combined case-based and aggregated data only =================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
appMgr$AggrMgr$ReadData(hivPlatform::GetSystemFile('testData', 'test_-_2_populations.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
appMgr$CaseMgr$RunAdjustments(hivPlatform::GetAdjustmentSpecs(
  c('Multiple Imputation using Chained Equations - MICE')
))

# STEP 3 - Set aggregated data selection -----------------------------------------------------------
aggrDataSelection <- data.table::data.table(
  Name = c(
    'Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'
  ),
  Use = c(TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  MinYear = c(1980, 1980, 1980, 1980, 1980, 1980, 1980, 1980),
  MaxYear = c(2017, 2016, 2016, 2016, 2016, 2016, 2016, 2016)
)
appMgr$HIVModelMgr$SetAggrFilters(aggrDataSelection)

# STEP 2 - Fit the HIV model -----------------------------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  # Select only case-based data for "Gender" = "M" (Male) and population "pop_0" from aggegated data
  # set
  popCombination = list(
    Case = list(list(Variables = c('Gender'), Values = c('M'))),
    CaseAbbr = c('M [G]'), # This is used only for printing
    Aggr = c('pop_0')
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 3 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'NON-PARAMETRIC')

# Bootstrap data
data <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult)
)
data <- data.table::rbindlist(lapply(data, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$DataSet,
    BootIteration = res$BootIteration
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  data,
  c('DataSet', 'BootIteration')
)

# Bootstrap stats
data <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)

dt <- haven::read_dta("D:/Downloads/TESSY_sample_allvars_small.dta")

appMgr <- hivPlatform::AppManager$new()
appMgr$LoadState("D:/Downloads/HIVPlatformState_20250307_183639.rds")
appMgr$HIVModelMgr$MainFitResult

state <- readRDS("D:/Downloads/HIVPlatformState_20250307_183639.rds")
jsonlite::fromJSON(state$UIState)

writeLines(
  state$UIState,
  "D:/Downloads/HIVPlatformState_20250307_183639.json",
  sep = ""
)

## A. Case-based data only =========================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(filePath = "D:/Downloads/modelling_data_norway_fake.csv")

# STEP 2 - Pre-process case-based data -------------------------------------------------------------

originalData <- appMgr$CaseMgr$OriginalData
attrMapping <- GetPreliminaryAttributesMapping(appMgr$CaseMgr$OriginalData)
data <- ApplyAttributesMapping(originalData, attrMapping)


attrMapping$RecordId$origColName <- "id_number"
attrMapping$Age$origColName <- NULL
attrMapping$Art$origColName <- NULL
attrMapping$Gender$origColName <- "sex"
attrMapping$FirstCD4Count$origColName <- "cd4"
attrMapping$CountryOfBirth$origColName <- "country_of_birth_iso_modelling"
attrMapping$DateOfNotification$origColName <- "notification_date"
attrMapping$DateOfHIVDiagnosis$origColName <- "hiv_date"
attrMapping$DateOfAIDSDiagnosis$origColName <- "aids_date_modelling3"
attrMapping$DateOfDeath$origColName <- "year_dead_outmig_modelling"

GetAttrMappingStatus(attrMapping)

appMgr$CaseMgr$ApplyAttributesMapping(attrMapping)
appMgr$CaseMgr$PreProcessArtifacts
appMgr$CaseMgr$PreProcessedData
appMgr$CaseMgr$PreProcessedDataStatus

originDistribution <- appMgr$CaseMgr$OriginDistribution
originGrouping <- GetOriginGroupingPreset('REPCOUNTRY + UNK + OTHER', originDistribution)
originGrouping[[1]]$MigrantRegionOfOrigin <- 'REPCOUNTRY'
originGrouping[[2]]$MigrantRegionOfOrigin <- 'UNK'
originGrouping[[3]]$MigrantRegionOfOrigin <- 'OTHER'

appMgr$CaseMgr$ApplyOriginGrouping(originGrouping)
appMgr$CaseMgr$PreProcessedData


appMgr$CaseMgr$OriginalData$firstcd4count[1:11]
appMgr$CaseMgr$PreProcessedData$SqCD4[1:11]
appMgr$CaseMgr$PreProcessedData$CD4Category[1:11]

caseData <- hivPlatform:::FilterCaseBasedData(
  appMgr$CaseMgr$PreProcessedData,
  appMgr$CaseMgr$Filters
)
aggrData <- appMgr$AggrMgr$Data

# Combination 'All data'
popCombination <- list(
  Case = NULL,
  Aggr = appMgr$AggrMgr$PopulationNames
)

# Aggregated data filters
aggrDataSelection <- NULL

res <- GetPopulationData(caseData, aggrData, popCombination, aggrDataSelection)
caseDataAll <- PrepareDataSetsForModel(caseData)
dataSets <- CombineData(caseDataAll, res$Aggr)[[1]]
dataSets <- Filter(function(dt) nrow(dt) > 0, dataSets)
optimalYears <- hivModelling::GetAllowedYearRanges(data = dataSets)
rangeYears <- lapply(dataSets, function(dt) dt[, c(min(Year), max(Year))])


context <- hivModelling::GetRunContext(
  data = dataSets,
  settings = list(),
  parameters = list(
    INCIDENCE = list()
  )
)
popData <- hivModelling::GetPopulationData(context)

startTime <- Sys.time()
fitResults <- hivModelling::PerformMainFit(
  context,
  popData,
  attemptSimplify = TRUE,
  verbose = TRUE
)


for (nm in names(dataSets)) {
  data.table::fwrite(dataSets[[nm]], file = sprintf("D:/Downloads/%s.csv", nm))
}
