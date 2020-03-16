rsconnect::setAccountInfo(
  name   = Sys.getenv('shinyapps_name'),
  token  = Sys.getenv('shinyapps_token'),
  secret = Sys.getenv('shinyapps_secret')
)

rsconnect::deployApp(
  appName = 'hivEstimatesAccuracyReloaded',
  appFiles = c('app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'R/', 'man/'),
  contentCategory = 'application',
  forceUpdate = TRUE
)
