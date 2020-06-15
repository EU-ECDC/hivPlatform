library(hivModelling)
library(hivEstimatesAccuracy2)

# Define count of MI data sets
M <- 5

# Define count of bootstrap data sets
B <- 10

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData('D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 2 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs, miCount = M)

# STEP 3 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData(settings = list(Verbose = FALSE))

# STEP 4 - Generate B bootstrapped case-based datasets for each pseudo-complete datasets -----------

appMgr$GenerateBoostrapCaseBasedDataSets(bsCount = B)

# STEP 5 - Fit the model to M x B bootstrapped case-based datasets ---------------------------------

appMgr$FitHIVModelToBootstrapData(verbose = FALSE)

# STEP 6 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()

# STEP 7 - Explore ---------------------------------------------------------------------------------

# Extract betas and plot scatter plots pair-wise
betas <- t(sapply(appMgr$GetFlatHIVBootstrapResults('Param'), '[[', 'Beta'))
colnames(betas) <- sprintf('Beta%d', seq_len(ncol(betas)))
pairs(betas)

# Extract thetas and plot scatter plots pair-wise
thetas <- t(sapply(appMgr$GetFlatHIVBootstrapResults('Param'), '[[', 'Theta'))
colnames(thetas) <- sprintf('Theta%d', seq_len(ncol(thetas)))
pairs(thetas)

# Check statistics (quantiles, means)
appMgr$HIVBootstrapStatistics$Beta
appMgr$HIVBootstrapStatistics$Theta
appMgr$HIVBootstrapStatistics$MainOutputs$N_HIV_Obs_M


bsCount <- B
bootResults <- list()
verbose <- FALSE
timeOut <- mean(sapply(appMgr$HIVModelResults, '[[', 'RunTime')) * 5
strata <- NULL
results <- list()
# i <- 1
for (i in seq_along(appMgr$HIVModelResults)) {
  hivModelResults <- appMgr$HIVModelResults[[i]]

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

  mainCaseBasedDataSet <- appMgr$FinalAdjustedCaseBasedData$Table[Imputation == i]

  bsResults <- list()
  # j <- 1
  for (j in seq_len(bsCount)) {
    startTime <- Sys.time()

    indices <- sample.int(nrow(mainCaseBasedDataSet), replace = TRUE)
    bootCaseBasedDataSet <- mainCaseBasedDataSet[indices]

    bootAggregatedData <- PrepareDataSetsForModel(bootCaseBasedDataSet)

    bootContext <- GetRunContext(
      parameters = context$Parameters,
      settings = context$Settings,
      data = bootAggregatedData
    )

    bootData <- GetPopulationData(bootContext)

    bsResults[[j]] <- PerformMainFit(bootContext, bootData, param = param, info = info)

    PrintAlert(
      'Fitting using initial parameters from adjusted data {.val {i}} |',
      'Bootstrap fit {.val {j}} |',
      'Run time: {.timestamp {prettyunits::pretty_dt(Sys.time() - startTime)}}',
      type = 'success'
    )
  }

  results[[i]] <- bsResults
}

length(bsResults)
