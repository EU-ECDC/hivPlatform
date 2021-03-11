context('CaseDataManager')

caseMgr <- CaseDataManager$new()

test_that('reading data is correct', {
  capture.output(
    caseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
  )

  expect_equal(basename(caseMgr$FileName), 'dummy_miss1.zip')
  expect_is(caseMgr$OriginalData, 'data.table')
  expect_equal(nrow(caseMgr$OriginalData), 7619)
  expect_equal(length(caseMgr$AttrMapping), 25)
  expect_true(caseMgr$AttrMappingStatus$Valid)
  expect_null(caseMgr$PreProcessArtifacts)
  expect_null(caseMgr$OriginDistribution)
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_length(caseMgr$OriginGrouping, 0)
  expect_null(caseMgr$Summary)
  expect_null(caseMgr$PreProcessedDataStatus)
  expect_null(caseMgr$PreProcessedData)
  expect_null(caseMgr$AdjustmentResult)
  expect_null(caseMgr$Data)
})

test_that('applying atrributes mapping is correct', {
  capture.output(caseMgr$ApplyAttributesMapping())

  expect_is(caseMgr$OriginalData, 'data.table')
  expect_equal(nrow(caseMgr$OriginalData), 7619)
  expect_equal(length(caseMgr$AttrMapping), 25)
  expect_true(caseMgr$AttrMappingStatus$Valid)
  expect_is(caseMgr$PreProcessArtifacts, 'list')
  expect_setequal(names(caseMgr$PreProcessArtifacts), c('MissGenderReplaced', 'MissGenderImputed'))
  expect_is(caseMgr$OriginDistribution, 'data.table')
  expect_setequal(colnames(caseMgr$OriginDistribution), c('origin', 'count'))
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_length(caseMgr$OriginGrouping, 0)
  expect_is(caseMgr$PreProcessedDataStatus, 'list')
  expect_true(caseMgr$PreProcessedDataStatus$Valid)
  expect_equal(length(caseMgr$PreProcessedDataStatus$CheckStatus), 25)
  expect_is(caseMgr$PreProcessedData, 'data.table')
  expect_equal(nrow(caseMgr$PreProcessedData), 7619)
  expect_equal(nrow(caseMgr$Data), 7619)
  expect_true(caseMgr$PreProcessedData[, all(Imputation == 0)])
  expect_null(caseMgr$AdjustmentResult)
  expect_null(caseMgr$Summary)
})

test_that('applying origin grouping is correct', {
  capture.output(caseMgr$ApplyOriginGrouping())

  expect_is(caseMgr$OriginalData, 'data.table')
  expect_equal(nrow(caseMgr$OriginalData), 7619)
  expect_equal(length(caseMgr$AttrMapping), 25)
  expect_true(caseMgr$AttrMappingStatus$Valid)
  expect_is(caseMgr$PreProcessArtifacts, 'list')
  expect_setequal(names(caseMgr$PreProcessArtifacts), c('MissGenderReplaced', 'MissGenderImputed'))
  expect_is(caseMgr$OriginDistribution, 'data.table')
  expect_setequal(colnames(caseMgr$OriginDistribution), c('origin', 'count'))
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_is(caseMgr$PreProcessedDataStatus, 'list')
  expect_true(caseMgr$PreProcessedDataStatus$Valid)
  expect_equal(length(caseMgr$PreProcessedDataStatus$CheckStatus), 25)
  expect_is(caseMgr$PreProcessedData, 'data.table')
  expect_equal(nrow(caseMgr$PreProcessedData), 7619)
  expect_true(caseMgr$PreProcessedData[, all(Imputation == 0)])
  expect_equal(nrow(caseMgr$Data), 7619)
  expect_null(caseMgr$AdjustmentResult)
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_equal(length(caseMgr$OriginGrouping), 15)
  expect_is(caseMgr$Summary, 'list')
  expect_setequal(
    names(caseMgr$Summary),
    c('DiagYearPlotData', 'NotifQuarterPlotData')
  )
})

test_that('adjusting is correct', {
  mockAdjustment <- setNames(
    list(GetListObject(GetSystemFile('testData', 'MockMICEAdjustment.R'))),
    'Mock MICE Adjustment'
  )
  capture.output(caseMgr$RunAdjustments(mockAdjustment))

  expect_is(caseMgr$OriginalData, 'data.table')
  expect_equal(nrow(caseMgr$OriginalData), 7619)
  expect_equal(length(caseMgr$AttrMapping), 25)
  expect_true(caseMgr$AttrMappingStatus$Valid)
  expect_is(caseMgr$PreProcessArtifacts, 'list')
  expect_setequal(names(caseMgr$PreProcessArtifacts), c('MissGenderReplaced', 'MissGenderImputed'))
  expect_is(caseMgr$OriginDistribution, 'data.table')
  expect_setequal(colnames(caseMgr$OriginDistribution), c('origin', 'count'))
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_is(caseMgr$PreProcessedDataStatus, 'list')
  expect_true(caseMgr$PreProcessedDataStatus$Valid)
  expect_equal(length(caseMgr$PreProcessedDataStatus$CheckStatus), 25)
  expect_is(caseMgr$PreProcessedData, 'data.table')
  expect_equal(nrow(caseMgr$PreProcessedData), 7619)
  expect_equal(nrow(caseMgr$AdjustedData), 22857)
  expect_equal(nrow(caseMgr$Data), 22857)
  expect_true(caseMgr$Data[, all(Imputation %in% c(0, 1, 2))])
  expect_is(caseMgr$OriginGrouping, 'list')
  expect_equal(length(caseMgr$OriginGrouping), 15)
  expect_is(caseMgr$Summary, 'list')
  expect_setequal(
    names(caseMgr$Summary),
    c('DiagYearPlotData', 'NotifQuarterPlotData')
  )
  expect_equal(caseMgr$AdjustmentTask$Status, 'SUCCESS')
  expect_is(caseMgr$AdjustmentResult, 'list')
  expect_equal(length(caseMgr$AdjustmentResult), 1)
  expect_is(caseMgr$LastAdjustmentResult, 'list')
  expect_equal(length(caseMgr$LastAdjustmentResult), 8)
})

test_that('reactive processing is correct', {
  mockAdjustment <- setNames(list(GetListObject(
    GetSystemFile('testData', 'MockMICEAdjustment.R')
  )), 'Mock MICE Adjustment')
  session <- shiny::MockShinySession$new()
  caseMgr <- CaseDataManager$new(session)
  capture.output({
    isolate(caseMgr$ReadData('D:/VirtualBox_Shared/dummy_miss1.zip'))
    isolate(caseMgr$ApplyAttributesMapping())
    isolate(caseMgr$ApplyOriginGrouping())
    session$flushReact()
    isolate(caseMgr$RunAdjustments(mockAdjustment))
  })

  expect_equal(basename(isolate(caseMgr$FileName)), 'dummy_miss1.zip')
  expect_is(isolate(caseMgr$Data), 'data.table')
  expect_equal(nrow(isolate(caseMgr$Data)), 7619)
  expect_equal(isolate(caseMgr$AdjustmentTask$Status), 'CREATED')

  Sys.sleep(5)
  capture.output(session$flushReact())

  expect_equal(isolate(caseMgr$AdjustmentTask$Status), 'SUCCESS')
  expect_equal(nrow(isolate(caseMgr$Data)), 22857)
})
