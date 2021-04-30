rsconnect::setAccountInfo(
  name   = Sys.getenv('SHINYAPPS_ACCOUNT'),
  token  = Sys.getenv('SHINYAPPS_TOKEN'),
  secret = Sys.getenv('SHINYAPPS_SECRET')
)

rsconnect::deployApp(
  account = 'nextpage',
  appName = 'hivPlatform',
  appFiles = c('app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'R/', 'man/', 'inst/', 'data/'),
  contentCategory = 'application',
  forceUpdate = TRUE
)
