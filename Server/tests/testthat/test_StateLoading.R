context('StateLoading')

stateFileName <- 'D:/Downloads/HIVPlatformState_20230109_174825.rds'
appMgr <- AppManager$new()
state <- readRDS(stateFileName)

test_that('loading state is correct', {
  appMgr$LoadState(stateFileName)

  expect_identical(appMgr$UIState, state$UIState)
  expect_identical(appMgr$Seed, state$Catalogs$Seed)
  expect_identical(appMgr$CompletedSteps, state$Catalogs$CompletedSteps)
  expect_identical(appMgr$ReportArtifacts, state$Catalogs$ReportArtifacts)
  expect_identical(appMgr$Report, state$Catalogs$Report)
  expect_identical(appMgr$CaseMgr$FilePath, state$CaseMgr$Catalogs$FilePath)
  expect_identical(appMgr$CaseMgr$FileName, state$CaseMgr$Catalogs$FileName)
  expect_identical(appMgr$CaseMgr$OriginalData, state$CaseMgr$Catalogs$OriginalData)
  expect_identical(appMgr$CaseMgr$AttrMapping, state$CaseMgr$Catalogs$AttrMapping)
  expect_identical(appMgr$CaseMgr$AttrMappingStatus, state$CaseMgr$Catalogs$AttrMappingStatus)
  expect_identical(appMgr$CaseMgr$OriginDistribution, state$CaseMgr$Catalogs$OriginDistribution)
  expect_identical(appMgr$CaseMgr$OriginGrouping, state$CaseMgr$Catalogs$OriginGrouping)
  expect_identical(appMgr$CaseMgr$PreProcessArtifacts, state$CaseMgr$Catalogs$PreProcessArtifacts)
  expect_identical(appMgr$CaseMgr$Filters, state$CaseMgr$Catalogs$Filters)
  expect_identical(appMgr$CaseMgr$PreProcessedData, state$CaseMgr$Catalogs$PreProcessedData)
  expect_identical(appMgr$CaseMgr$PreProcessedDataStatus, state$CaseMgr$Catalogs$PreProcessedDataStatus) # nolint
  expect_identical(appMgr$CaseMgr$AdjustedData, state$CaseMgr$Catalogs$AdjustedData)
  expect_identical(names(appMgr$CaseMgr$AdjustmentResult), names(state$CaseMgr$Catalogs$AdjustmentResult)) # nolint
  expect_identical(appMgr$CaseMgr$MigrationResult, state$CaseMgr$Catalogs$MigrationResult)
  expect_identical(appMgr$AggrMgr$FileName, state$AggrMgr$Catalogs$FileName)
  expect_identical(appMgr$AggrMgr$Data, state$AggrMgr$Catalogs$Data)
  expect_identical(appMgr$AggrMgr$PopulationNames, state$AggrMgr$Catalogs$PopulationNames)
  expect_identical(appMgr$HIVModelMgr$MigrConnFlag, state$HIVModelMgr$Catalogs$MigrConnFlag)
  expect_identical(appMgr$HIVModelMgr$PopCombination, state$HIVModelMgr$Catalogs$PopCombination)
  expect_identical(appMgr$HIVModelMgr$AggrDataSelection, state$HIVModelMgr$Catalogs$AggrDataSelection) # nolint
  expect_identical(appMgr$HIVModelMgr$MainFitResult, state$HIVModelMgr$Catalogs$MainFitResult)
  expect_identical(appMgr$HIVModelMgr$AvgModelOutputs, state$HIVModelMgr$Catalogs$AvgModelOutputs)
  expect_identical(appMgr$HIVModelMgr$Years, state$HIVModelMgr$Catalogs$Years)
  expect_identical(appMgr$HIVModelMgr$BootstrapFitResult, state$HIVModelMgr$Catalogs$BootstrapFitResult) # nolint
  expect_identical(appMgr$HIVModelMgr$BootstrapFitStats, state$HIVModelMgr$Catalogs$BootstrapFitStats) # nolint
  expect_identical(appMgr$HIVModelMgr$PlotData, state$HIVModelMgr$Catalogs$PlotData)
})
