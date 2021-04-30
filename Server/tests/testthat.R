library(shiny)
library(data.table)

if (requireNamespace('testthat', quietly = TRUE)) {
  testthat::test_package('hivPlatform')
} else {
  PrintAlert('Skipping tests')
}
