CheckOriginGroupingForMigrant <- function(
  originGrouping
) {
  allowedNames <- c(
    'REPCOUNTRY', 'UNK',
    'EUROPE-NORTH AMERICA',
    'AFRICA',
    'ASIA',
    'CARIBBEAN-LATIN AMERICA',
    'OTHER'
  )

  migrantOrigins <- unique(sapply(originGrouping, '[[', 'MigrantRegionOfOrigin'))
  wrongNames <- migrantOrigins[!(migrantOrigins %chin% allowedNames)]
  valid <- length(wrongNames) == 0
  message <- ifelse(
    valid,
    'Grouping is compatible with the migration module',
    'Grouping is not compatible until all regions for migration module parameters are given'
  )

  result <- list(
    Valid = valid,
    WrongNames = wrongNames,
    Message = message
  )

  return(result)
}
