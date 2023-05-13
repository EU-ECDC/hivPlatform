Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

appMgr <- hivPlatform::AppManager$new()
appMgr$CaseMgr$ReadData('G:/My Drive/Projects/19. PZH/Testing/Bootstrap 3 - Polish data/PL.csv')
attributeMapping <- GetPreliminaryAttributesMapping(appMgr$CaseMgr$OriginalData)
attributeMapping[['DateOfFirstCD4Count']]$origColName <- 'FirstCD4Date'
attributeMapping[['DateOfLatestCD4Count']]$origColName <- 'CD4LatestDate'
attributeMapping[['DateOfLatestVLCount']]$origColName <- 'VLLatestDate'
attributeMapping[['DateOfArt']]$origColName <- 'ARTDate'

res <- GetPopulationData(caseData, aggrData, popCombination, aggrDataSelection)
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE)
)

caseData <- PrepareDataSetsForModel(appMgr$CaseMgr$Data)
lapply(
  names(caseData),
  function(dataName) {
    WriteDataFile(caseData[[dataName]], file.path('G:/My Drive/Projects/19. PZH/Testing/Bootstrap 3 - Polish data', paste0(dataName, '.csv')))
  }
)
