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
