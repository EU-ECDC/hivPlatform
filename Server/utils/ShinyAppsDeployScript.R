rsconnect::setAccountInfo(
  name   = Sys.getenv('shinyapps_name'),
  token  = Sys.getenv('shinyapps_token'),
  secret = Sys.getenv('shinyapps_secret')
)

rsconnect::deployApp(
  account = 'nextpage',
  appName = 'hivEstimatesAccuracy2',
  appFiles = c('app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'R/', 'man/', 'inst/', 'data/'),
  contentCategory = 'application',
  forceUpdate = TRUE
)

# Test callr
taskHandle <- callr::r_bg(
  function() {
    for (i in seq_len(10)) {
      Sys.sleep(1/2)
      cat(i, '\n')
    }
    cat('Done')
  }
)

taskHandle <- callr::r_bg(
  function(cars) {
    Sys.sleep(5)
    print(cars[sample(nrow(cars), 10), ])
  },
  args = list(cars)
)

runLog <- ''
while (taskHandle$is_alive()) {
  runLog <- paste(
    runLog,
    CollapseTexts(taskHandle$read_output(), collapse = '\n'),
    sep = ''
  )
  Sys.sleep(1)
}
runLog <- paste(
  runLog,
  CollapseTexts(taskHandle$read_all_output(), collapse = '\n'),
  sep = ''
)
cat(runLog)

taskHandle$get_result()

taskHandle <- callr::r_bg(
  function(appMgr) {
    adjustmentSpecs <- hivEstimatesAccuracy2:::GetAdjustmentSpecs(c(
      'Multiple Imputation using Chained Equations - MICE'
    ))
    appMgr$AdjustCaseBasedData(miCount = 2, adjustmentSpecs)
  },
  args = list(appMgr)
)

runLog <- ''
while (taskHandle$is_alive()) {
  cat(CollapseTexts(taskHandle$read_output(), collapse = '\n'))
  # runLog <- paste(
  #   runLog,
  #   CollapseTexts(taskHandle$read_output(), collapse = '\n'),
  #   sep = ''
  # )
  Sys.sleep(1)
}

runLog <- paste(
  runLog,
  CollapseTexts(taskHandle$read_all_output(), collapse = '\n'),
  sep = ''
)

taskHandle
taskHandle$read_all_output()
taskHandle$read_all_error()
taskHandle$read_error_lines()
taskHandle$is_alive()
taskHandle$get_memory_info()
taskHandle$read_output_lines()
