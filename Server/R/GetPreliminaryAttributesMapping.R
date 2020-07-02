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
      'referenceData/requiredColumns.R', package = 'hivEstimatesAccuracy2'
    ),
    includeFileName = FALSE
  )
  requiredColumnNames <- names(columnSpecs)
  origColNames <- names(origData)

  # Get column mapping
  attrMapping <- sapply(names(columnSpecs), function(x) NULL)

  # 1. Fixed matching first
  if (
    'FirstCD4Count' %in% requiredColumnNames &
    'cd4_num' %in% origColNames
  ) {
    attrMapping[['FirstCD4Count']] <- 'cd4_num'
    requiredColumnNames <- setdiff(requiredColumnNames, 'FirstCD4Count')
    origColNames <- setdiff(origColNames, 'cd4_num')
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
    if (min(distance) < 6) {
      bestMatchColumn <- origColNames[which.min(adist(requiredColumnName, origColNames, ignore.case = TRUE))]
      # Remove matched column from searching in the next step.
      if (!is.na(bestMatchColumn)) {
        attrMapping[[requiredColumnName]] <- bestMatchColumn
        origColNames <- setdiff(origColNames, bestMatchColumn)
      }
    }
  }

  return(attrMapping)
}
