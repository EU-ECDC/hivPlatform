list(
  RecordId = list(
    desciption = 'Unique identifier for each record within and across the national surveillance system',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('recordid')
  ),
  ReportingCountry = list(
    description = 'The country reporting the record',
    type = 'character',
    values = union('UNK', countryData$Code),
    defaultValue = NA_character_,
    origColNames = c('reportingcountry')
  ),
  Age = list(
    description = 'Exact age at diagnosis of HIV. Age as a crude number is preferred',
    type = 'numeric',
    defaultValue = NA_real_,
    origColNames = c('age')
  ),
  Gender = list(
    description = 'Gender',
    type = 'character',
    values = c('', 'UNK', 'F', 'M', 'O'),
    defaultValue = NA_character_,
    origColNames = c('gender')
  ),
  Transmission = list(
    description = 'Describes the most probable route of Transmission',
    type = 'character',
    values = c('', 'UNK', 'HAEMO', 'HETERO', 'IDU', 'MSM', 'MTCT', 'NOSO', 'TRANSFU'),
    defaultValue = NA_character_,
    origColNames = c('transmission')
  ),
  FirstCD4Count = list(
    description = 'CD4 cell count at time of diagnosis',
    type = 'numeric',
    defaultValue = NA_real_,
    origColNames = c('cd4_num')
  ),
  LatestCD4Count = list(
    description = 'Latest CD4',
    type = 'numeric',
    defaultValue = NA_character_,
    origColNames = c('cd4latest')
  ),
  LatestVLCount = list(
    description = 'Latest viral load test count',
    type = 'numeric',
    defaultValue = NA_character_,
    origColNames = c('vllatest')
  ),
  AcuteInfection = list(
    description = 'Acute infection type',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('acuteinfection')
  ),
  Art = list(
    description = 'Indicator of antiretroviral therapy',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('art')
  ),
  HIVStatus = list(
    description = 'Status of HIV',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('hivstatus')
  ),
  CountryOfBirth = list(
    description = 'Country of birth of patient',
    type = 'character',
    values = union(c('', 'UNK'), countryData$Code),
    defaultValue = NA_character_,
    origColNames = c('countryofbirth')
  ),
  CountryOfNationality = list(
    description = 'Country of nationality of patient',
    type = 'character',
    values = union(c('', 'UNK'), countryData$Code),
    defaultValue = NA_character_,
    origColNames = c('countryofnationality')
  ),
  RegionOfOrigin = list(
    description = 'Region of origin of patient',
    type = 'character',
    values = c(
      '', 'UNK', 'ABROAD', 'AUSTNZ', 'CAR', 'CENTEUR', 'EASTASIAPAC', 'EASTEUR', 'EUROPE', 'LATAM',
      'NORTHAFRMIDEAST', 'NORTHAM', 'REPCOUNTRY', 'SOUTHASIA', 'SUBAFR', 'WESTEUR'
    ),
    defaultValue = NA_character_,
    origColNames = c('regionoforigin')
  ),
  PlaceOfNotification = list(
    description = 'Place of notification',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('placeofnotification')
  ),
  PlaceOfResidence = list(
    description = 'Place of residence',
    type = 'character',
    defaultValue = NA_character_,
    origColNames = c('placeofresidence')
  ),
  DateOfNotification = list(
    description = 'Date of notification',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('dateofnotificationisodate')
  ),
  DateOfHIVDiagnosis = list(
    description = 'Date of HIV diagnosis',
    type = 'date',
    defaultValue = as.Date(NA),
    restrictedValues = as.Date(NA),
    origColNames = c('dateofdiagnosisisodate')
  ),
  DateOfAIDSDiagnosis = list(
    description = 'Date of AIDS diagnosis',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('dateofaidsdiagnosisisodate')
  ),
  DateOfFirstCD4Count = list(
    description = 'Date of First CD4 cell count',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('firstcd4dateisodate')
  ),
  DateOfLatestCD4Count = list(
    description = 'Date of latest CD4 count',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('cd4latestdateisodate')
  ),
  DateOfLatestVLCount = list(
    description = 'Date of latest viral load test',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('vllatestdateisodate')
  ),
  DateOfDeath = list(
    description = 'Date of death',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('dateofdeathisodate')
  ),
  DateOfArrival = list(
    description = 'Date of arrival',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('yearofarrivalisodate')
  ),
  DateOfArt = list(
    description = 'Date of latest antiretroviral therapy',
    type = 'date',
    defaultValue = as.Date(NA),
    origColNames = c('artdateisodate')
  )
)
