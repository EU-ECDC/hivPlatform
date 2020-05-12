library(hivModelling)
library(hivEstimatesAccuracy2)

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))

appManager <- AppManager$new()
appManager$ReadCaseBasedData('D:/VirtualBox_Shared/BE.csv')
appManager$PreProcessCaseBasedData()
appManager$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 1 - Perform MI as usual to obtain M pseudo-complete datasets -------------------------

appManager$AdjustCaseBasedData(adjustmentSpecs)
adjustedData <- appManager$AdjustedCaseBasedData$`1. Multiple Imputation using Chained Equations - MICE`$Table[Imputation != 0]

# STEP 2 - Fit the model to M pseudocomplete datasets get the estimates ---------------------

hivModelDataSet <- PrepareDataSetsForModel(adjustedData, splitBy = 'Imputation')

# Iterate over imputations
imputation <- 1

originalContext <- GetRunContext(data = hivModelDataSet[[imputation]], parameters = list())
data <- GetPopulationData(originalContext)
mainResults <- PerformMainFit(originalContext, data)
paramInit <- mainResults$Param
infoInit <- mainResults$Info

# STEP 3 - Perform non-parametric Bootstrap of each of the M case-based datasets ------------

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
