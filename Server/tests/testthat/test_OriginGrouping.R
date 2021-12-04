context('OriginGrouping')

capture.output({
  appMgr <- AppManager$new()
  appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
  appMgr$CaseMgr$ApplyAttributesMapping()
  distr <- appMgr$CaseMgr$OriginDistribution
})

test_that('default grouping presets is correct', {
  grouping <- GetOriginGroupingPreset()
  expect_type(grouping, 'list')
  expect_length(grouping, 3)
  expect_setequal(sapply(grouping, '[[', 'GroupedRegionOfOrigin'), c('REPCOUNTRY', 'OTHER', 'UNK'))

  capture.output({
    appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = grouping)
  })
  expect_setequal(
    appMgr$CaseMgr$PreProcessedData[, as.character(unique(GroupedRegionOfOrigin))],
    c(NA_character_, 'REPCOUNTRY', 'OTHER')
  )
})

test_that('migrant-related grouping presets are correct', {
  groupingDetailed <- GetOriginGroupingPreset('REPCOUNTRY + UNK + EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + OTHER') # nolint
  grouping <- GetOriginGroupingPreset('REPCOUNTRY + UNK + EUROPE + AFRICA + ASIA + OTHER') # nolint

  checkResult <- CheckOriginGroupingForMigrant(groupingDetailed)
  expect_type(checkResult, 'list')
  expect_true(checkResult$Valid)
  expect_length(groupingDetailed, 9)
  expect_setequal(
    sapply(groupingDetailed, '[[', 'GroupedRegionOfOrigin'),
    c(
      'REPCOUNTRY', 'UNK', 'OTHER', 'CARIBBEAN-LATIN AMERICA', 'EUROPE-OTHER', 'EASTERN EUROPE',
      'AFRICA-OTHER', 'SUB-SAHARAN AFRICA', 'ASIA'
    )
  )
  expect_setequal(
    sapply(groupingDetailed, '[[', 'MigrantRegionOfOrigin'),
    c('REPCOUNTRY', 'UNK', 'EUROPE', 'AFRICA', 'ASIA', 'CARIBBEAN-LATIN AMERICA')
  )

  expect_length(grouping, 6)
  expect_setequal(
    sapply(grouping, '[[', 'GroupedRegionOfOrigin'),
    c('REPCOUNTRY', 'UNK', 'OTHER', 'EUROPE', 'AFRICA', 'ASIA')
  )
  expect_setequal(
    sapply(grouping, '[[', 'MigrantRegionOfOrigin'),
    c('REPCOUNTRY', 'UNK', 'EUROPE', 'AFRICA', 'ASIA')
  )
})
