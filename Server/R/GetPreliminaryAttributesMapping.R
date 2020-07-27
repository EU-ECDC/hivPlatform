#' GetPreliminaryAttributesMapping
#'
#' Gets attributes mappings.
#'
#' @param origData Original data. Required.
#' @param maxDistance Maximum allowed generalized Levenshtein distance between internal and origina
#'   column name. Optional. Default = 4
#'
#' @return list with attributes mapping
#'
#' @examples
#' \dontrun{
#' GetPreliminaryAttributesMapping(origData)
#' }
#'
#' @export
GetPreliminaryAttributesMapping <- function(origData, maxDistance = 4)
{
  stopifnot(!missing(origData))

  # Get required columns
  columnSpecs <- GetListObject(
    system.file(
      'referenceData/requiredColumns.R', package = 'hivEstimatesAccuracy2'
    ),
    includeFileName = FALSE
  )
  requiredColumnNames <- names(columnSpecs)
  origColNames <- names(origData)

  # Initialize column mapping
  attrMapping <- sapply(names(columnSpecs), function(x) NULL)

  # 1. Fixed matching first
  # requiredColumnName <- requiredColumnNames[1]
  for (requiredColumnName in requiredColumnNames) {
    fixedColNames <- columnSpecs[[requiredColumnName]]$origColNames
    # fixedColName <- fixedColNames[1]
    for (fixedColName in fixedColNames) {
      if (fixedColName %in% origColNames) {
        attrMapping[[requiredColumnName]] <- fixedColName
        requiredColumnNames <- setdiff(requiredColumnNames, requiredColumnName)
        origColNames <- setdiff(origColNames, fixedColName)
        break
      }
    }
  }

  # 2. Exact matching second
  exactMatchIndices <- match(tolower(requiredColumnNames), tolower(origColNames))
  if (any(!is.na(exactMatchIndices))) {
    attrMapping[requiredColumnNames] <- origColNames[exactMatchIndices]
    requiredColumnNames <- requiredColumnNames[is.na(exactMatchIndices)]
    origColNames <- setdiff(origColNames, origColNames[exactMatchIndices])
  }

  # 3. Fuzzy matching third
  for (requiredColumnName in requiredColumnNames) {
    # Fuzzy string matching
    distance <- as.vector(adist(requiredColumnName, origColNames, ignore.case = TRUE))
    if (min(distance) <= maxDistance) {
      bestMatchColumn <-
        origColNames[which.min(adist(requiredColumnName, origColNames, ignore.case = TRUE))]
      # Remove matched column from searching in the next step.
      if (!is.na(bestMatchColumn)) {
        attrMapping[[requiredColumnName]] <- bestMatchColumn
        origColNames <- setdiff(origColNames, bestMatchColumn)
      }
    }
  }

  return(attrMapping)
}
