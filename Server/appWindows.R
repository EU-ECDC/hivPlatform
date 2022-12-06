Sys.setenv(RSTUDIO_PANDOC = file.path(dirname(getwd()), 'dist/pandoc'))
hivPlatform::RunApp(
  launchBrowser = TRUE,
  stopOnSessionEnded = TRUE
)
