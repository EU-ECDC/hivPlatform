library(shiny)
library(data.table)

if (requireNamespace('testthat', quietly = TRUE)) {
  testthat::test_package('hivEstimatesAccuracy2')
} else {
  PrintAlert('Skipping tests')
}
