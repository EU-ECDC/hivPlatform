rsconnect::setAccountInfo(
  name   = Sys.getenv('SHINYAPPS_ACCOUNT'),
  token  = Sys.getenv('SHINYAPPS_TOKEN'),
  secret = Sys.getenv('SHINYAPPS_SECRET')
)

Sys.setenv(SHINYAPPS_ACCOUNT = 'nextpage')
Sys.setenv(SHINYAPPS_APP_NAME = 'hivPlatform-migrant')
rsconnect::deployApp(
  account = Sys.getenv('SHINYAPPS_ACCOUNT'),
  appName = Sys.getenv('SHINYAPPS_APP_NAME'),
  appFiles = c('app.R', 'DESCRIPTION', 'LICENSE', 'NAMESPACE', 'R/', 'man/', 'inst/', 'data/'),
  contentCategory = 'application',
  forceUpdate = TRUE
)
