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
task <- CreateTask(function() {
  print('Start of run')
  Sys.sleep(5)
  dt <- cars[sample(nrow(cars), 10), ]
  print('End of run')
  return(dt)
})

task$completed()
task$state()
task$result()
task$runLog()
task$startTime()
task$cpuTime()
task$cancel()

taskHandle <- task$taskHandle()
taskHandle$is_alive()
taskHandle$is_incomplete_error()
taskHandle$is_incomplete_output()
taskHandle$get_result()
taskHandle$kill()
taskHandle$get_exit_status()
taskHandle$finalize()
taskHandle$read_error()
taskHandle$read_output()
taskHandle$get_cpu_times()
taskHandle$get_start_time()
