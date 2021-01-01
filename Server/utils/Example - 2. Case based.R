library(hivEstimatesAccuracy2)

appMgr <- AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$ApplyAttributesMappingToCaseBasedData()
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping(groups = list())

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs)
appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result

# STEP 5 - Fit the HIV model -----------------------------------------------------------------------

if (!is.null(appMgr$FinalAdjustedCaseBasedData$Table)) {
  caseBasedData <- appMgr$FinalAdjustedCaseBasedData$Table
} else {
  caseBasedData <- appMgr$PreProcessedCaseBasedData$Table
}

dataSets <- CombineData(
  caseBasedData = copy(appMgr$FinalAdjustedCaseBasedData$Table),
  aggregatedData = copy(appMgr$AggregatedData),
  popCombination = appMgr$PopulationCombination,
  aggrDataSelection = appMgr$AggregatedDataSelection
)

settings <- list(Verbose = FALSE)
parameters <- list()
results <- list()
# i <- 1
for (i in seq_along(dataSets)) {
  context <- hivModelling::GetRunContext(
    data = dataSets[[i]],
    settings = settings,
    parameters = parameters
  )
  data <- hivModelling::GetPopulationData(context)

  startTime <- Sys.time()
  fitResults <- hivModelling::PerformMainFit(context, data, attemptSimplify = TRUE)
  runTime <- Sys.time() - startTime

  results[[i]] <- list(
    Context = context,
    Data = data,
    Results = fitResults,
    RunTime = runTime
  )
}





appMgr$FitHIVModel()
appMgr$HIVModelResults <- appMgr$HIVModelTask$Result
cat(appMgr$HIVModelTask$RunLog)
cat(appMgr$HIVModelTask$HTMLRunLog)

# STEP 6 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$RunBootstrap(bsCount = 5)
appMgr$HIVBootstrapModelResults <- appMgr$BootstrapTask$Result
cat(appMgr$BootstrapTask$RunLog)

# STEP 7 - Calculate statistics for every output column --------------------------------------------
appMgr$ComputeHIVBootstrapStatistics()

# STEP 8 - Explore bootstrap results ---------------------------------------------------------------
# All data sets
hist(appMgr$HIVBootstrapStatistics$RunTime)
table(appMgr$HIVBootstrapStatistics$Converged)

# Successful fits only data sets
appMgr$HIVBootstrapStatistics$Beta
pairs(appMgr$HIVBootstrapStatistics$Beta)
appMgr$HIVBootstrapStatistics$BetaStats

appMgr$HIVBootstrapStatistics$Theta
pairs(appMgr$HIVBootstrapStatistics$Theta)
appMgr$HIVBootstrapStatistics$ThetaStats

appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIV_Obs_M
appMgr$HIVBootstrapStatistics$MainOutputsStats$N_HIVAIDS_M

# STEP 9 - Generate report -------------------------------------------------------------------------
appMgr$GenerateReport()
appMgr$Report <- appMgr$ReportTask$Result
