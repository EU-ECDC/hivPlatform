GetSystemFile <- function(
  ...,
  package = 'hivEstimatesAccuracy2'
) {
  return(system.file(..., package = package))
}
