library(hivEstimatesAccuracy2)

adjustmentSpecs <- GetAdjustmentSpecs(c(
  "Multiple Imputation using Chained Equations - MICE"
))

appManager <- AppManager$new()
appManager$ReadCaseBasedData("~/share/HIV_HIV_PL - Copy.xls")
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
appManager$Plots$DiagnosisYearDensity
appManager$Plots$NotificationQuarterDensity

// class(appManager$Plots$DiagnosisYearDensity)
// class(appManager$Plots$NotificationQuarterDensity)
// plotly:::to_JSON(appManager$Plots$NotificationQuarterDensity)
