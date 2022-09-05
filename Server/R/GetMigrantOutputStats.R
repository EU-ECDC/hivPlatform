#' @export
GetMigrantOutputStats <- function(
  data
) {
  migrantRegions <- union('ALL', data[, unique(MigrantRegionOfOrigin)])
  stats <- setNames(lapply(migrantRegions, function(region) {
    list(
      Total = GetMigrantConfBounds(data, strat = 'Total', region),
      Sex = GetMigrantConfBounds(data, strat = 'Gender', region),
      AgeGroup = GetMigrantConfBounds(data, strat = 'AgeGroup', region),
      Transmission = GetMigrantConfBounds(data, strat = 'Transmission', region),
      GroupedRegionOfOrigin = GetMigrantConfBounds(data, strat = 'GroupedRegionOfOrigin', region)
    )
  }), migrantRegions)

  return(list(
    TableDistr = stats
  ))
}
