#' GetPreliminaryAttributesMapping
#'
#' Gets attributes mappings.
#'
#' @param origData Original data. Required.
#'
#' @return list with attributes mapping
#'
#' @examples
#' \dontrun{
#' GetPreliminaryAttributesMapping(origData)
#' }
#'
#' @export
GetPreliminaryAttributesMapping <- function(origData)
{
  stopifnot(!missing(origData))

  # Get required columns
  columnSpecs <- GetListObject(
    system.file(
      'referenceData/requiredColumns.R',
      package = 'hivEstimatesAccuracy2'
    ),
    includeFileName = FALSE
  )

  # Get column mapping
  attrMapping <- sapply(names(columnSpecs), function(x) NULL)
  origColNames <- names(origData)
  # requiredColumnName <- 'FirstCD4DateYear'
  for (requiredColumnName in names(columnSpecs)) {
    # Fuzzy string matching
    bestMatchColumn <- origColNames[which.min(adist(requiredColumnName, origColNames, ignore.case = TRUE))]
    # Remove matched column from searching in the next step.
    if (!is.na(bestMatchColumn)) {
      attrMapping[[requiredColumnName]] <- bestMatchColumn
      origColNames <- setdiff(origColNames, bestMatchColumn)
    }
  }

  return(attrMapping)
}
