library(hivEstimatesAccuracy2)

adjustmentSpecs <- GetAdjustmentSpecs(c(
  "Multiple Imputation using Chained Equations - MICE"
))

appManager <- AppManager$new()
appManager$ReadCaseBasedData("~/share/dummy_miss1.zip")
appManager$PreProcessCaseBasedData()
appManager$ApplyOriginGrouping("REPCOUNTRY + UNK + OTHER")
appManager$AdjustCaseBasedData(adjustmentSpecs)
appManager$CreatePlots()
appManager$CreateReport("Main Report")

appManager$CaseBasedDataPath
appManager$CaseBasedData
appManager$AttributeMapping
appManager$AttributeMappingStatus
appManager$PreProcessedCaseBasedData
appManager$PreProcessedCaseBasedDataStatus
appManager$AdjustedCaseBasedData
appManager$Plots$DiagnosisYearDensity
appManager$Plots$NotificationQuarterDensity
