Sys.setenv(RSTUDIO_PANDOC = file.path(dirname(getwd()), 'dist/pandoc'))
options(shiny.maxRequestSize = 100 * 1024^2)
hivPlatform::RunApp(launchBrowser = TRUE, port = NULL)
