context('PreProcessBeforeSummary')

capture.output({
  appMgr <- AppManager$new()
  appMgr$CaseMgr$ReadData(GetSystemFile('testData', 'dummy_miss1.zip'))
  appMgr$CaseMgr$ApplyAttributesMapping()
  data <- appMgr$CaseMgr$PreProcessedData
})

test_that('type of explanatory columns is correct', {
  expect_true(is.factor(data$Gender))
  expect_true(is.factor(data$Transmission))
  expect_true(is.numeric(data$SqCD4))
  expect_true(is.character(data$FullRegionOfOrigin))
})

test_that('missings in explanatory columns are NAs', {
  expect_equal(sum(is.na(data$Gender)), 0)
  expect_equal(sum(is.na(data$Transmission)), 1581)
  expect_equal(sum(is.na(data$SqCD4)), 3726)
  expect_equal(sum(is.na(data$FullRegionOfOrigin)), 1944)
})
