context('OriginGrouping')

capture.output({
  appMgr <- AppManager$new()
  appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
  appMgr$CaseMgr$ApplyAttributesMapping()
})

test_that('default grouping presets is correct', {
  grouping <- GetOriginGroupingPreset()
  expect_type(grouping, 'list')
  expect_length(grouping, 3)
  expect_setequal(sapply(grouping, '[[', 'name'), c('REPCOUNTRY', 'OTHER', 'UNK'))
  expect_false(CheckOriginGroupingForMigrant(grouping))
  expect_error(ConvertOriginGroupingForMigrant(grouping))
})

test_that('migrant-related grouping presets are correct', {
  groupingDetailed <- GetOriginGroupingPreset('EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER') # nolint
  grouping <- GetOriginGroupingPreset('EUROPE + AFRICA + ASIA + UNK + OTHER') # nolint

  expect_true(CheckOriginGroupingForMigrant(groupingDetailed))
  expect_length(groupingDetailed, 7)
  expect_setequal(
    sapply(groupingDetailed, '[[', 'name'),
    c(
      'UNK', 'OTHER', 'CARIBBEAN-LATIN AMERICA', 'EUROPE-OTHER', 'EASTERN EUROPE', 'AFRICA-OTHER',
      'SUB-SAHARAN AFRICA'
    )
  )
  expect_true(CheckOriginGroupingForMigrant(grouping))
  expect_length(grouping, 4)
  expect_setequal(sapply(grouping, '[[', 'name'), c('UNK', 'OTHER', 'EUROPE', 'AFRICA'))

  expect_identical(ConvertOriginGroupingForMigrant(groupingDetailed), grouping)
})
