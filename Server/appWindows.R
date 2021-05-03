tryCatch({
  pb <- winProgressBar(
    title = sprintf('HIV Platform'),
    label = 'Starting application in default web browser',
    initial = 1
  )

  Sys.setenv(RSTUDIO_PANDOC = file.path(dirname(getwd()), 'dist/pandoc'))

  # Load hivPlatform package
  pkgload::load_all(path = '.', export_all = FALSE, helpers = FALSE, attach_testthat = FALSE)

  close(pb)

  options(shiny.maxRequestSize = 100 * 1024^2)
  hivPlatform::RunApp(launchBrowser = TRUE, port = NULL)
},
finally = {
  close(pb)
})
