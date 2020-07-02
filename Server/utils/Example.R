library(hivEstimatesAccuracy2)

# STEP 1 - Load case-based dataset -----------------------------------------------------------------

appMgr <- AppManager$new()
appMgr$ReadCaseBasedData(fileName = 'D:/VirtualBox_Shared/dummy_miss1.zip')
appMgr$PreProcessCaseBasedData()
appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

# STEP 2 - Perform MI as usual to obtain M pseudo-complete datasets --------------------------------

adjustmentSpecs <- GetAdjustmentSpecs(c(
  'Multiple Imputation using Chained Equations - MICE'
))
appMgr$AdjustCaseBasedData(miCount = 2, adjustmentSpecs)

# STEP 3 - Fit the model to M pseudo-complete datasets get the estimates ---------------------------

appMgr$FitHIVModelToAdjustedData(settings = list(Verbose = FALSE))

# STEP 4 - Fit the model to M x B pseudo-complete bootstrapped datasets get the estimates ----------

appMgr$FitHIVModelToBootstrapData(bsCount = 5, verbose = FALSE)

# STEP 5 - Calculate statistics for every output column --------------------------------------------

appMgr$ComputeHIVBootstrapStatistics()

# STEP 6 - Explore ---------------------------------------------------------------------------------

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


type <- 'REPCOUNTRY + UNK + OTHER'
type <- 'Custom'
distr <- GetOriginDistribution(appMgr$PreProcessedCaseBasedData$Table)
groups <- list()
dtMap <- GetOriginGroupingMap(type, distr)
dtList <- ConvertOriginGroupingDtToList(dtMap)
ConvertOriginGroupingListToDt(dtList)

private$Catalogs$PreProcessedCaseBasedData <- ApplyOriginGroupingMap(
  private$Catalogs$PreProcessedCaseBasedData,
  map
)

test <- list(
  list(Name = 'UNK', Regions = c('UNK')),
  list(Name = 'OTHER', Regions = c('ABROAD', 'AUSTNZ')),
  list(Name = 'REPCOUNTRY', Regions = c('REPCOUNTRY'))
)

appMgr$CaseBasedData
appMgr$AttributeMapping
appMgr$AttributeMappingStatus

dt <- ApplyAttributesMapping(
  originalData = appMgr$CaseBasedData,
  attrMapping = appMgr$AttributeMapping,
  defaultValues = GetPreliminaryDefaultValues()
)

dt <- PreProcessInputDataBeforeSummary(inputData = dt)
dtStatus <- GetInputDataValidityStatus(inputData = dt$Table)

appMgr$OriginGroupingType <- 'Custom'
dt <- appMgr$PreProcessedCaseBasedData$Table
dt[is.na(GroupedRegionOfOrigin), unique(FullRegionOfOrigin)]


plotDT <- appMgr$PreProcessedCaseBasedData$Table
counts <- plotDT[, .(Count = .N), keyby = .(Gender, DateOfDiagnosisYear = year(DateOfDiagnosisISODate))]
categories <- sort(unique(counts$DateOfDiagnosisYear))

appMgr$SendEventToReact('shinyHandler', list(
  Type = 'SUMMARY_DATA_PREPARED',
Status = 'SUCCESS',
  Payload = list(
    DiagnosisYearFilterData = list(
      ScaleMinYear = min(categories),
      ScaleMaxYear = max(categories),
      ValueMinYear = min(categories),
      ValueMaxYear = max(categories)
    ),
    DiagnosisYearChartCategories = categories,
    DiagnosisYearChartData = list(
      list(
        name = 'Female',
        data = counts[Gender == 'F', Count]
      ),
      list(
        name = 'Male',
        data = counts[Gender == 'M', Count]
      )
    )
  )
))

appMgr$GetSummaryData()

plotDT <- appMgr$PreProcessedCaseBasedData$Table
counts <- plotDT[,
                 .(Count = .N),
                 keyby = .(Gender, DateOfDiagnosisYear = year(DateOfDiagnosisISODate))
]
categories <- sort(unique(counts$DateOfDiagnosisYear))

counts <- plotDT[,
  .(Count = .N),
  keyby = .(Gender, DateOfNotificationQuarter = year(DateOfNotificationISODate) + quarter(DateOfNotificationISODate) / 4)
]
categories <- sort(unique(counts$DateOfNotificationQuarter))



