library(hivEstimatesAccuracyReloaded)

appManager <- AppManager$new()

appManager$ReadCaseBasedData('~/share/dummy_miss1.zip')
appManager$PreProcessCaseBasedData()
appManager$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')

appManager$CaseBasedDataPath
appManager$CaseBasedData
appManager$AttributeMapping
appManager$AttributeMappingStatus
appManager$PreProcessedCaseBasedData
appManager$PreProcessedCaseBasedDataStatus
