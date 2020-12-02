library(hivEstimatesAccuracy2)

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData(fileName = 'D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$ApplyAttributesMappingToCaseBasedData()
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping(groups = list())

# dt <- appMgr$GetSummaryData()
# jsonlite:::asJSON(dt, keep_vec_names = TRUE)

# STEP 2 - Load aggregated dataset -----------------------------------------------------------------
appMgr$ReadAggregatedData(fileName = 'D:/VirtualBox_Shared/HIV test files/Data/test NL - 2 populations.zip')

# STEP 3 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(adjustmentSpecs)
appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result

cat(appMgr$AdjustmentTask$RunLog)
cat(appMgr$AdjustmentTask$HTMLRunLog)

# STEP 4 - Combine case-based and aggregated data --------------------------------------------------

popCombinations <- list(
  All1 = list(
    CaseBasedPopulations = c('Gender_M', 'Gender_F'),
    AggrPopulations = c('pop_0', 'pop_1')
  ),
  All2 = list(
    CaseBasedPopulations = c(),
    AggrPopulations = c('pop_0', 'pop_1')
  ),
  Male = list(
    CaseBasedPopulations = c('Gender_M'),
    AggrPopulations = c('pop_0')
  ),
  Female = list(
    CaseBasedPopulations = c('Gender_F'),
    AggrPopulations = c('pop_1')
  ),
  None = list(
    CaseBasedPopulations = c('Gender_FG'),
    AggrPopulations = c()
  ),
  CaseBasedOnly = list(
    CaseBasedPopulations = c('Gender_M'),
    AggrPopulations = c()
  ),
  AggregatedOnly = list(
    CaseBasedPopulations = c('Gender_FG'),
    AggrPopulations = c('pop_0', 'pop_1')
  )
)

aggrDataSelection <- data.table(
  DataType = c('Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'),
  Use = c(TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)

caseBasedData <- copy(appMgr$FinalAdjustedCaseBasedData$Table)
aggregatedData <- copy(appMgr$AggregatedData)

CombineData <- function(
  caseBasedData,
  aggregatedData,
  popCombination = popCombinations[['AggregatedOnly']],
  aggrDataSelection
) {
  # 1. Filter case based data
  if (length(popCombination$CaseBasedPopulations) > 0) {
    listObj <- strsplit(popCombination$CaseBasedPopulations, '_')
    columnNames <- vapply(listObj, '[[', 1, FUN.VALUE = character(1))
    values <- vapply(listObj, function(el) {
      if (length(el) > 1) {
        paste(el[-1], collapse = '_')
      } else {
        ''
      }
    }, FUN.VALUE = character(1))
    filters <- data.table(ColumnName = columnNames, Value = values)

    dt1 <- list()
    for (i in seq_len(nrow(filters))) {
      dt1[[i]] <- caseBasedData[as.character(get(filters$ColumnName[i])) %chin% filters$Value[i]]
    }
    dt1 <- rbindlist(dt1)
  } else {
    dt1 <- copy(caseBasedData)
  }

  set1 <- PrepareDataSetsForModel(dt1, splitBy = 'Imputation')

  # 2. Filter aggregated data
  set2 <- lapply(aggregatedData, function(el) {
    if (
      !is.null(popCombination$AggrPopulations) &&
      all(popCombination$AggrPopulations %chin% colnames(el))
    ) {
      el[, .(Count = sum(.SD)), keyby = .(Year), .SDcols = popCombination$AggrPopulations]
    } else {
      data.table(Year = integer(), Count = numeric())
    }
  })

  # 3. Combine data sets together
  dataTypes <- c('AIDS', 'Dead', 'HIV', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4', 'HIVAIDS')
  if (any(dataTypes %in% names(set1))) {
    set1DataTypes <- names(set1)
    set2DataTypes <- names(set2)
    allDataTypes <- union(set1DataTypes, set2DataTypes)
    finalSet <- lapply(allDataTypes, function(dataType) {

    })
  } else {

  }
}





# STEP 5 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData()

cat(appMgr$ModelTask$RunLog)
cat(appMgr$ModelTask$HTMLRunLog)

# STEP 6 - Fit the model to M x B pseudo-complete bootstrapped datasets get the estimates ----------

appMgr$FitHIVModelToBootstrapData(bsCount = 5, verbose = FALSE)

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
