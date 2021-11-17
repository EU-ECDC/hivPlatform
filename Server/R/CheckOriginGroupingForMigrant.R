CheckOriginGroupingForMigrant <- function(
  originGrouping,
  data
) {
  allowedNames <- c(
    'REPCOUNTRY',
    'EUROPE', 'EASTERN EUROPE', 'EUROPE-OTHER',
    'AFRICA', 'SUB-SAHARAN AFRICA', 'AFRICA-OTHER',
    'ASIA',
    'CARIBBEAN-LATIN AMERICA',
    'OTHER',
    NA_character_
  )

  data <- ApplyGrouping(
    copy(data),
    originGrouping,
    from = 'FullRegionOfOrigin',
    to = 'GroupedRegionOfOrigin'
  )
  ApplyGrouping(
    data,
    originGrouping,
    from = 'GroupedRegionOfOrigin',
    to = 'MigrantRegionOfOrigin'
  )

  migrantOrigins <- unique(data$MigrantRegionOfOrigin)
  wrongNames <- migrantOrigins[!(migrantOrigins %chin% allowedNames)]
  valid <- length(wrongNames) == 0
  message <- ifelse(
    valid,
    'Grouping is compatible with the migration module',
    sprintf(
      'Grouping is not compatible with the migration module. The following unsupported grouped regions appear in the migrant origin: %s', # nolint
      paste(wrongNames, collapse = ', ')
    )
  )

  result <- list(
    Valid = valid,
    WrongNames = wrongNames,
    Message = message
  )

  return(result)
}
