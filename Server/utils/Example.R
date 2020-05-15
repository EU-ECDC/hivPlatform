library(hivModelling)
library(hivEstimatesAccuracy2)

M <- 10L
B <- 5L

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
adjustmentSpecs$`Multiple Imputation using Chained Equations - MICE`$Parameters$nimp$value <- M

appManager <- AppManager$new()
appManager$ReadCaseBasedData('D:/VirtualBox_Shared/BE.csv')
appManager$PreProcessCaseBasedData()
appManager$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 1 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

appManager$AdjustCaseBasedData(adjustmentSpecs)
appManager$PrepareAggregatedData()

# STEP 1a - Fit the model to M pseudo-complete datasets get the estimates --------------------------

aggregatedDataSets <- appManager$AggregatedData

step1a <- list()
for (i in seq_along(aggregatedDataSets)) {
  context <- GetRunContext(data = aggregatedDataSets[[i]], parameters = list())
  data <- GetPopulationData(context)
  results <- PerformMainFit(context, data)

  step1a[[i]] <-  list(
    Context = context,
    Data = data,
    Results = results
  )
}

# STEP 2, 3 and 5A - Perform non-parametric Bootstrap of each of the M case-based datasets ---------

caseBasedDataSets <- split(
  appManager$FinalAdjustedCaseBasedData$Table[Imputation != 0],
  by = 'Imputation'
)

step2 <- list()
for (i in seq_len(M)) {
  caseBasedData <- caseBasedDataSets[[i]]
  context <- step1a[[i]]$Context
  param <- step1a[[i]]$Results$Param
  info <- step1a[[i]]$Results$Info

  for (j in seq_len(B)) {
    # 1. Bootstrap case-based data
    indices <- sample(nrow(caseBasedData), replace = TRUE)
    bootCaseBasedData <- caseBasedData[indices]

    # 2. Create aggregated data set
    bootAggregatedData <- PrepareDataSetsForModel(bootCaseBasedData)

    # 3. Create context
    bootContext <- GetRunContext(
      data = bootAggregatedData,
      parameters = context$Parameters
    )

    # 4. Create final data set for the model
    bootData <- GetPopulationData(bootContext)

    # 5. Fit the model. Arguments "param" and "info" are provided, therefore a search for the
    # best fitting parameters is carried out starting from the supplied starting point for
    # beta and thetaF..
    step2[[B * (i - 1) + j]] <- PerformMainFit(bootContext, bootData, param = param, info = info)
  }
}

# STEP 4 - Extract the estimated parameter vector --------------------------------------------------

mainOutputsList <- lapply(step2, '[[', 'MainOutputs')

# STEP 6A and 7A - Calculate parameters of interest ------------------------------------------------

colNames <- colnames(mainOutputsList[[1]])

quantiles <- setNames(lapply(colNames, function(colName) {
  resultSample <- sapply(mainOutputsList, '[[', colName)
  resultQuantiles <- t(apply(resultSample, 1, quantile, c(0.025, 0.5, 0.975)))
  return(resultQuantiles)
}), colNames)

means <- setNames(lapply(colNames, function(colName) {
  resultSample <- sapply(mainOutputsList, '[[', colName)
  resultQuantiles <- t(apply(resultSample, 1, mean))
  return(resultQuantiles)
}), colNames)
