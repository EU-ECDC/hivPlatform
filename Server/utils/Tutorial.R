.libPaths(
  c(
    'D:/_REPOSITORIES/hivEstimatesAccuracy2/Server/renv/library/R-4.1/x86_64-w64-mingw32',
    'D:/Documents/R/win-library/4.1'
  )
)
devtools::install(quick = TRUE)

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
    reportingDelay = TRUE,
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
