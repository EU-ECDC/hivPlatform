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
rp1 <- callr::r_bg(function() { for (i in seq_len(10)) {Sys.sleep(1/2); print(i) }; print('Done')}, stdout = 'D:/test.txt')
for (i in seq_len(15)) {
  cat(paste(readLines('D:/test.txt'), collapse = '\n'))
  Sys.sleep(0.5)
}

