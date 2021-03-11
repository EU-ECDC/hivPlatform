context('CombineData')

capture.output({
  appMgr <- AppManager$new()
  appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
  appMgr$CaseMgr$ApplyAttributesMapping()
  appMgr$CaseMgr$ApplyOriginGrouping()
  appMgr$AggrMgr$ReadData(GetSystemFile('testData', 'test_-_2_populations.zip'))
  caseData <- appMgr$CaseMgr$Data
  aggrData <- appMgr$AggrMgr$Data
})

popCombination <- list(
  Case = list(
    list(Values = c('M', 'MSM'), Variables = c('Gender', 'Transmission'))
  ),
  Aggr = c('pop_0')
)
aggrDataSelection <- data.table(
  Name = c(
    'Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'
  ),
  Use = c(TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
  MinYear = c(1990, 1991, 1992, 1992, 1992, 1992, 1992, 1992),
  MaxYear = c(2015, 2019, 2013, 2013, 2013, 2013, 2013, 2013)
)

test_that('combining NULL data is correct', {
  expect_null(CombineData(NULL, NULL, NULL, NULL))
  expect_null(CombineData(NULL, NULL, popCombination, NULL))
  expect_null(CombineData(NULL, NULL, NULL, aggrDataSelection))
  expect_null(CombineData(NULL, NULL, popCombination, aggrDataSelection))
})

test_that('combining full data is correct', {
  dataAll <- CombineData(caseData, aggrData, popCombination, aggrDataSelection)
  expect_is(dataAll, 'list')
  expect_equal(length(dataAll), 1)
  expect_equal(names(dataAll), '0')

  dataCaseOnly <- CombineData(caseData, NULL, popCombination, aggrDataSelection)
  expect_is(dataCaseOnly, 'list')
  expect_equal(length(dataCaseOnly), 1)
  expect_equal(names(dataCaseOnly), '0')

  dataAggrOnly <- CombineData(NULL, aggrData, popCombination, aggrDataSelection)
  expect_is(dataAggrOnly, 'list')
  expect_equal(length(dataAggrOnly), 1)
  expect_equal(names(dataAggrOnly), '0')

  expect_equal(
    sum(dataAll$`0`$HIV_CD4_4$Count),
    sum(dataCaseOnly$`0`$HIV_CD4_4$Count) + sum(dataAggrOnly$`0`$HIV_CD4_4$Count)
  )
  expect_equal(
    sum(aggrData$HIV_CD4_4[Year %between% c(1992, 2013), pop_0]),
    sum(dataAggrOnly$`0`$HIV_CD4_4$Count)
  )
})

test_that('combining full data is correct', {
  popCombination <- list(
    Case = list(
      list(Values = c('M'), Variables = c('Gender')),
      list(Values = c('F'), Variables = c('Gender'))
    ),
    Aggr = NULL
  )
  dataCaseExplicit <- CombineData(caseData, aggrData, popCombination, aggrDataSelection)
  expect_equal(sum(dataCaseExplicit$`0`$HIV_CD4_4$Count), 10)

  data <- CombineData(caseData, aggrData, NULL, aggrDataSelection)
  expect_equal(sum(data$`0`$HIV_CD4_4$Count), 10)

  popCombination <- list(
    Case = NULL,
    Aggr = NULL
  )
  dataCaseImplicit <- CombineData(caseData, aggrData, NULL, NULL)
  expect_equal(sum(dataCaseImplicit$`0`$HIV_CD4_4$Count), 10)

  expect_identical(dataCaseExplicit, dataCaseImplicit)
})
