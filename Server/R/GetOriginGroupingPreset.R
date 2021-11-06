#' GetOriginGroupingPreset
#'
#' Get mapping from RegionOfOrigin to GroupOfOrigin
#'
#' @param type Grouping type. Default = 'REPCOUNTRY + UNK + OTHER'
#' @param distr Distribution of RegionOfOrigin
#'
#' @return NULL
#'
#' @examples
#' distr <- data.table::data.table(
#'   origin = c('REPCOUNTRY', 'SUBAFR'),
#'   count = c(1536, 2237)
#' )
#' GetOriginGroupingPreset(
#'   type = 'REPCOUNTRY + UNK + 3 most prevalent regions + OTHER',
#'   distr = distr
#' )
#'
#' @export
GetOriginGroupingPreset <- function(
  type = 'REPCOUNTRY + UNK + OTHER',
  distr
) {
  # Initialize mapping
  map <- c(
    'UNK', 'ABROAD', 'AUSTNZ', 'CAR', 'CENTEUR', 'EASTASIAPAC', 'EASTEUR', 'EUROPE', 'LATAM',
    'NORTHAFRMIDEAST', 'NORTHAM', 'REPCOUNTRY', 'SOUTHASIA', 'SUBAFR', 'WESTEUR'
  )
  names(map) <- map

  # Adjust according to type
  switch(
    type,
    'EUROPE + AFRICA + ASIA + UNK + OTHER' = ,
    'EASTERN EUROPE + EUROPE-OTHER + AFRICA + ASIA + UNK + OTHER' = ,
    'EUROPE + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + UNK + OTHER' = ,
    'EUROPE + AFRICA + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = ,
    'EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + UNK + OTHER' = ,
    'EASTERN EUROPE + EUROPE-OTHER + AFRICA + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = ,
    'EUROPE + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = ,
    'EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = { # nolint
      map[map %chin% c('EASTEUR')] <- 'EASTERN EUROPE'
      map[map %chin% c('CENTEUR', 'WESTEUR', 'EUROPE', 'NORTHAM')] <- 'EUROPE-OTHER'
      map[map %chin% c('SUBAFR')] <- 'SUB-SAHARAN AFRICA'
      map[map %chin% c('NORTHAFRMIDEAST')] <- 'AFRICA-OTHER'
      map[map %chin% c('CAR', 'LATAM')] <- 'CARIBBEAN-LATIN AMERICA'
      map[map %chin% c('SOUTHASIA', 'EASTASIAPAC')] <- 'ASIA'
      map[!(map %chin% c('EASTERN EUROPE', 'EUROPE-OTHER', 'SUB-SAHARAN AFRICA', 'AFRICA-OTHER',  'ASIA', 'CARIBBEAN-LATIN AMERICA', 'UNK'))] <- 'OTHER' # nolint
    },
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
    }
  )

  # Second pass for migrant-compatible presets
  switch(type,
    'EUROPE + AFRICA + ASIA + UNK + OTHER' = {
      map[map %chin% c('EASTERN EUROPE', 'EUROPE-OTHER')] <- 'EUROPE'
      map[map %chin% c('SUB-SAHARAN AFRICA', 'AFRICA-OTHER')] <- 'AFRICA'
      map[map %chin% c('CARIBBEAN-LATIN AMERICA')] <- 'OTHER'
    },
    'EASTERN EUROPE + EUROPE-OTHER + AFRICA + ASIA + UNK + OTHER' = {
      map[map %chin% c('SUB-SAHARAN AFRICA', 'AFRICA-OTHER')] <- 'AFRICA'
      map[map %chin% c('CARIBBEAN-LATIN AMERICA')] <- 'OTHER'
    },
    'EUROPE + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + UNK + OTHER' = {
      map[map %chin% c('EASTERN EUROPE', 'EUROPE-OTHER')] <- 'EUROPE'
      map[map %chin% c('CARIBBEAN-LATIN AMERICA')] <- 'OTHER'
    },
    'EUROPE + AFRICA + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = {
      map[map %chin% c('EASTERN EUROPE', 'EUROPE-OTHER')] <- 'EUROPE'
      map[map %chin% c('SUB-SAHARAN AFRICA', 'AFRICA-OTHER')] <- 'AFRICA'
    },
    'EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + UNK + OTHER' = {
      map[map %chin% c('CARIBBEAN-LATIN AMERICA')] <- 'OTHER'
    },
    'EASTERN EUROPE + EUROPE-OTHER + AFRICA + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = {
      map[map %chin% c('SUB-SAHARAN AFRICA', 'AFRICA-OTHER')] <- 'AFRICA'
    },
    'EUROPE + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = {
      map[map %chin% c('EASTERN EUROPE', 'EUROPE-OTHER')] <- 'EUROPE'
    },
    'EASTERN EUROPE + EUROPE-OTHER + SUB-SAHARAN AFRICA + AFRICA-OTHER + ASIA + CARIBBEAN-LATIN AMERICA + UNK + OTHER' = { # nolint
    }
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

  map <- ConvertOriginGroupingDtToList(map)

  return(map)
}
