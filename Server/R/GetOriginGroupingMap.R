#' GetOriginGroupingMap
#'
#' Get mapping from RegionOfOrigin to GroupOfOrigin
#'
#' @param type Grouping type
#' @param distr Distribution of RegionOfOrigin
#' @param groups Groups
#'
#' @return NULL
#'
#' @examples
#' distr <- data.table::data.table(
#'   origin = c('REPCOUNTRY', 'SUBAFR'),
#'   count = c(1536, 2237)
#' )
#' GetOriginGroupingMap(
#'   type = 'REPCOUNTRY + UNK + 3 most prevalent regions + OTHER',
#'   distr = distr
#' )
#'
#' @export
GetOriginGroupingMap <- function(type, distr, groups = list())
{
  # Initialize mapping
  map <- c(
    'UNK', 'ABROAD', 'AUSTNZ', 'CAR', 'CENTEUR', 'EASTASIAPAC', 'EASTEUR', 'EUROPE', 'LATAM',
    'NORTHAFRMIDEAST', 'NORTHAM', 'REPCOUNTRY', 'SOUTHASIA', 'SUBAFR', 'WESTEUR'
  )
  names(map) <- map

  # Adjust according to type
  switch(
    type,
    'REPCOUNTRY + UNK + OTHER' = ,
    'REPCOUNTRY + UNK + 3 most prevalent regions + OTHER' = {
      map[
        map %chin% c(
          'ABROAD', 'SUBAFR', 'WESTEUR', 'CENTEUR', 'EASTEUR', 'EASTASIAPAC', 'EUROPE', 'AUSTNZ',
          'SOUTHASIA', 'NORTHAFRMIDEAST', 'NORTHAM', 'CAR', 'LATAM'
        )
      ] <- 'OTHER'
    },
    'REPCOUNTRY + UNK + SUBAFR + OTHER' = {
      map[
        map %chin% c(
          'ABROAD', 'WESTEUR', 'CENTEUR', 'EASTEUR', 'EASTASIAPAC', 'EUROPE', 'AUSTNZ', 'SOUTHASIA',
          'NORTHAFRMIDEAST', 'NORTHAM', 'CAR', 'LATAM'
        )
      ] <- 'OTHER'
    },
    'Custom' = {
      for (group in groups) {
        map[map %chin% group$origin] <- group$name
      }
    },
    stop('Unsupported type')
  )

  map <- as.data.table(map, keep.rownames = TRUE)
  setnames(map, c('origin', 'name'))

  if (type == 'REPCOUNTRY + UNK + 3 most prevalent regions + OTHER') {
    sepRegions <- head(
      distr[!origin %chin% c('REPCOUNTRY', 'UNK'), origin],
      3
    )
    map[origin %chin% sepRegions, name := origin]
  }

  # Add count per origin
  map[distr,
    originCount := count,
    on = .(origin)
  ]
  map[is.na(originCount), originCount := 0]

  # Add count per GroupedRegionOfOrigin
  map[, groupCount := sum(originCount), by = .(name)]

  map[,
    name := factor(name, levels = unique(name))
  ]

  return(map)
}
