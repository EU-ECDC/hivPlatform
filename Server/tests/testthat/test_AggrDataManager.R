context('AggrDataManager')

aggrMgr <- AggrDataManager$new()

test_that('reading data is correct', {
  capture.output(aggrMgr$ReadData(GetSystemFile('TestData', 'test_NL_-_2_populations.zip')))

  expect_equal(basename(aggrMgr$FileName), 'test_NL_-_2_populations.zip')
  expect_is(aggrMgr$Data, 'list')
  expect_equal(length(aggrMgr$Data), 8)
  expect_true(all(sapply(aggrMgr$Data, is.data.table)))
  expect_setequal(colnames(aggrMgr$Data[[1]]), c('Year', 'pop_0', 'pop_1'))
})
