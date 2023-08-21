appMgr <- AppManager$new()
# appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_full1.zip'))
appMgr$CaseMgr$ReadData('G:/My Drive/Projects/19. PZH/Data/tutorial_data_full1.csv')
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(
  originGroupingPreset = 'REPCOUNTRY + UNK + EUROPE-NORTH AMERICA + AFRICA + ASIA + OTHER'
)

outputPath <- 'G:/My Drive/Projects/19. PZH/Testing/Bootstrap 5 - dummy full'
caseData <- PrepareDataSetsForModel(appMgr$CaseMgr$Data)
dir.create(outputPath, showWarnings = FALSE, recursive = TRUE)
sapply(
  names(caseData),
  function(dataName) {
    WriteDataFile(caseData[[dataName]], file.path(outputPath, paste0(dataName, '.csv')))
  }
)
