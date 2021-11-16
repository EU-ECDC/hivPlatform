CheckOriginGroupingForMigrant <- function(
  originGrouping,
  distr
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

  distr <- ApplyGrouping(
    distr,
    originGrouping,
    from = 'FullRegionOfOrigin',
    to = 'GroupedRegionOfOrigin'
  )
  distr <- ApplyGrouping(
    distr,
    originGrouping,
    from = 'GroupedRegionOfOrigin',
    to = 'MigrantRegionOfOrigin'
  )

  result <- all(toupper(distr$MigrantRegionOfOrigin) %chin% toupper(allowedNames))

  return(result)
}
