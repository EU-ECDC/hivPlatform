Sys.setenv(RSTUDIO_PANDOC = file.path(dirname(getwd()), 'dist/pandoc'))
hivPlatform::RunApp(port = 3306L)
