library(hivModelling)
library(hivEstimatesAccuracy2)

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))

appManager <- AppManager$new()
appManager$ReadCaseBasedData('D:/VirtualBox_Shared/BE.csv')
appManager$PreProcessCaseBasedData()
appManager$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 1 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

appManager$AdjustCaseBasedData(adjustmentSpecs)
appManager$PrepareAggregatedData()

# STEP 2 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

caseBasedDataSets <- split(
  appManager$FinalAdjustedCaseBasedData$Table[Imputation != 0],
  by = 'Imputation'
)
aggregatedDataSets <- appManager$AggregatedData

# i <- 1
for (i in length(aggregatedDataSets)) {
  caseBasedData <- caseBasedDataSets[[i]]
  aggregatedData <- aggregatedDataSets[[i]]

  context <- GetRunContext(data = aggregatedData, parameters = list())
  data <- GetPopulationData(context)
  results <- PerformMainFit(context, data)
  param <- results$Param
  info <- results$Info

  # j <- 1
  newResults <- list()
  for (j in seq_len(2)) {
    # 1. Bootstrap case-based data
    indices <- sample(nrow(caseBasedData), replace = TRUE)
    sampleCaseBasedData <- caseBasedData[indices]

    # 2. Create aggregated data set
    newAggregatedData <- PrepareDataSetsForModel(sampleCaseBasedData)

    # 3. Create context
    newContext <- GetRunContext(
      data = newAggregatedData,
      parameters = list(
        ModelMinYear = context$Parameters$INCIDENCE$ModelMinYear,
        ModelMaxYear = context$Parameters$INCIDENCE$ModelMaxYear
      )
    )

    # 4. Create final data set for the model
    newData <- GetPopulationData(newContext)

    # 5. Fit the model. Arguments "param" and "info" are provided, therefore a search for the
    # best fitting parameters is carried out starting from the supplied starting point for
    # beta and thetaF..
    newResults[[j]] <- PerformMainFit(
      newContext,
      newData,
      param = param,
      info = info
    )
  }
}

originalContext <- GetRunContext(data = hivModelDataSet[[imputation]], parameters = list())
data <- GetPopulationData(originalContext)
mainResults <- PerformMainFit(originalContext, data)
paramInit <- mainResults$Param
infoInit <- mainResults$Info

# STEP 3 - Perform non-parametric Bootstrap of each of the M case-based datasets -------------------

caseBasedData <- adjustedData[Imputation == imputation]

bootstrapResults <- list()
for (iter in seq_len(2)) {
  # 1. Bootstrap case-based data
  indices <- sample(nrow(caseBasedData), replace = TRUE)
  sampleCaseBasedData <- caseBasedData[indices]

  # 2. Create aggregated data set
  hivModelDataSet <- PrepareDataSetsForModel(sampleCaseBasedData)

  # 3. Create context
  context <- GetRunContext(data = hivModelDataSet, parameters = list())

  # context <- GetRunContext(data = hivModelDataSet, parameters = list(
  #   ModelMinYear = originalContext$Parameters$INCIDENCE$ModelMinYear,
  #   ModelMaxYear = originalContext$Parameters$INCIDENCE$ModelMaxYear
  # ))

  # context$Parameters$INCIDENCE$ModelMinYear <- 'equal to original'
  # context$Parameters$INCIDENCE$ModelMaxYear <- 'equal to original'

  # 4. Create final data set for the model
  data <- GetPopulationData(context)

  # 5. Fit the model. Arguments "param" and "info" are provided, therefore a search for the
  # best fitting parameters is carried out starting from the supplied starting point for
  # beta and thetaF..
  bootstrapResults[[iter]] <- PerformMainFit(context, data, param = paramInit, info = infoInit)
}
