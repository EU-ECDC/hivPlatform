CheckOriginGroupingForMigrant <- function(
  originGrouping
) {
  allowedNames <- c('EUROPE', 'AFRICA', 'ASIA', 'CARIBBEAN-LATIN AMERICA', 'REPCOUNTRY', 'UNK')

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
