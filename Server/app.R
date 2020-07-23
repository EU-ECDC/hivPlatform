# Load data.table library manually. For some reason it is not loaded automatically on shinyapps
library(data.table)

# Load hivEstimatesAccuracy2 package
pkgload::load_all(path = '.', export_all = FALSE, helpers = FALSE, attach_testthat = FALSE)

shiny::shinyApp(AppUI, AppServer)
