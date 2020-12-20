library(hivEstimatesAccuracy2)

appMgr <- AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$ReadAggregatedData('D:/VirtualBox_Shared/HIV test files/Data/test NL - 2 populations.zip')

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$ApplyAttributesMappingToCaseBasedData()
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping(groups = list())
summaryData <- appMgr$GetSummaryData()
summaryDataJson <- jsonlite:::asJSON(summaryData, keep_vec_names = TRUE)

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Joint Modelling Multiple Imputation'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs)
appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result
cat(appMgr$AdjustmentTask$RunLog)
cat(appMgr$AdjustmentTask$HTMLRunLog)

# STEP 4 - Combine case-based and aggregated data --------------------------------------------------
dt <- appMgr$FinalAdjustedCaseBasedData$Table
dt[Imputation == 1, table(is.na(SqCD4))]
dt[Imputation == 0, table(is.na(SqCD4))]
appMgr$PopulationCombination
appMgr$AggregatedDataSelection
appMgr$CombineData()

# STEP 5 - Fit the HIV model -----------------------------------------------------------------------
appMgr$FitHIVModel()
appMgr$HIVModelResults <- appMgr$HIVModelTask$Result
cat(appMgr$HIVModelTask$RunLog)
cat(appMgr$HIVModelTask$HTMLRunLog)

# STEP 6 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$RunBootstrap(bsCount = 5, verbose = FALSE)


avgRunTime <- mean(sapply(appMgr$HIVModelResults, '[[', 'RunTime'))
maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')

PrintAlert('Maximum allowed run time: {.timestamp {prettyunits::pretty_dt(maxRunTime)}}')

miCount <- length(appMgr$HIVModelResults)
results <- list()
for (i in seq_len(miCount)) {

  PrintH2('Adjusted data {.val {i}}')

  hivModelResults <- private$Catalogs$HIVModelResults[[i]]

  context <- hivModelResults$Context
  param <- hivModelResults$Results$Param
  info <- hivModelResults$Results$Info

  context$Settings <- modifyList(
    context$Settings,
    list(
      ModelFilePath = NULL,
      InputDataPath = NULL,
      Verbose = verbose
    ),
    keep.null = TRUE
  )

  mainCaseBasedDataSet <- self$FinalAdjustedCaseBasedData$Table[Imputation == i]

  bootResults <- list()
  jSucc <- 1
  j <- 0
  while (jSucc <= bsCount) {
    j <- j + 1

    # Bootstrap data set
    indices <- sample.int(nrow(mainCaseBasedDataSet), replace = TRUE)
    bootCaseBasedDataSet <- mainCaseBasedDataSet[indices]
    bootAggregatedData <- PrepareDataSetsForModel(bootCaseBasedDataSet)

    bootContext <- hivModelling::GetRunContext(
      parameters = context$Parameters,
      settings = context$Settings,
      data = bootAggregatedData
    )

    bootData <- hivModelling::GetPopulationData(bootContext)

    startTime <- Sys.time()
    bootResult <- hivModelling::PerformMainFit(
      bootContext, bootData, param = param, info = info, attemptSimplify = FALSE,
      maxRunTime = maxRunTime
    )
    runTime <- Sys.time() - startTime

    msgType <- ifelse(bootResult$Converged, 'success', 'danger')

    PrintAlert(
      'Fit to data set {.val {jSucc}} done |',
      'Run time: {.timestamp {prettyunits::pretty_dt(runTime)}}',
      type = msgType
    )

    bootResults[[j]] <- list(
      Context = bootContext,
      Data = bootData,
      Results = bootResult,
      RunTime = runTime
    )

    if (bootResult$Converged) {
      jSucc <- jSucc + 1
    }

    progress <- (jSucc + (i - 1) * bsCount) / (miCount * bsCount) * 100
    self$SendEventToReact('shinyHandler', list(
      Type = 'BOOTSTRAP_RUN_PROGRESSES',
      Status = 'SUCCESS',
      Payload = list(
        Progress = progress
      )
    ))
  }

  results[[i]] <- bootResults
}




# STEP 7 - Calculate statistics for every output column --------------------------------------------
appMgr$ComputeHIVBootstrapStatistics()

# STEP 8 - Explore ---------------------------------------------------------------------------------

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
