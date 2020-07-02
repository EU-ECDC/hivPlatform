list(
  RecordId = list(
    desciption = 'Unique identifier for each record within and across the national surveillance system',
    type = 'character',
    defaultValue = NA_character_
  ),
  ReportingCountry = list(
    description = 'The country reporting the record',
    type = 'character',
    values = union('UNK', countryData$Code),
    defaultValue = NA_character_
  ),
  Age = list(
    description = 'Exact age at diagnosis of HIV. Age as a crude number is preferred',
    type = 'numeric',
    defaultValue = NA_real_
  ),
  Gender = list(
    description = 'Gender',
    type = 'character',
    values = c('', 'UNK', 'F', 'M', 'O'),
    defaultValue = NA_character_
  ),
  Transmission = list(
    description = 'Describes the most probable route of Transmission',
    type = 'character',
    values = c('', 'UNK', 'HAEMO', 'HETERO', 'IDU', 'MSM', 'MTCT', 'NOSO', 'TRANSFU'),
    defaultValue = NA_character_
  ),
  FirstCD4Count = list(
    description = 'CD4 cell count at time of diagnosis',
    type = 'numeric',
    defaultValue = NA_real_
  ),
  CD4Latest = list(
    description = 'Latest CD4',
    type = 'character',
    defaultValue = NA_character_
  ),
  CountryOfBirth = list(
    description = 'Country of birth of patient',
    type = 'character',
    values = union(c('', 'UNK'), countryData$Code),
    defaultValue = NA_character_
  ),
  CountryOfNationality = list(
    description = 'Country of nationality of patient',
    type = 'character',
    values = union(c('', 'UNK'), countryData$Code),
    defaultValue = NA_character_
  ),
  RegionOfOrigin = list(
    description = 'Region of origin of patient.',
    type = 'character',
    values = c('', 'UNK', 'ABROAD', 'AUSTNZ', 'CAR', 'CENTEUR', 'EASTASIAPAC', 'EASTEUR', 'EUROPE',
               'LATAM', 'NORTHAFRMIDEAST', 'NORTHAM', 'REPCOUNTRY', 'SOUTHASIA', 'SUBAFR', 'WESTEUR'),
    defaultValue = NA_character_
  ),
  PlaceOfNotification = list(
    description = 'Place of notification',
    type = 'character',
    defaultValue = NA_character_
  ),
  PlaceOfResidence = list(
    description = 'Place of residence',
    type = 'character',
    defaultValue = NA_character_
  ),
  Art = list(
    description = 'Art',
    type = 'character',
    defaultValue = NA_character_
  ),
  VLLatest = list(
    description = 'Latest VL',
    type = 'character',
    defaultValue = NA_character_
  ),
  AcuteInfection = list(
    description = 'Acute infection',
    type = 'character',
    defaultValue = NA_character_
  ),
  DateOfNotificationISODate = list(
    description = 'ISO date of notification',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  FirstCD4DateISODate = list(
    description = 'ISO date of First CD4 cell count at time of diagnosis',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  DateOfAIDSDiagnosisISODate = list(
    description = 'ISO date of AIDS diagnosis',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  DateOfDeathISODate = list(
    description = 'ISO date of death',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  DateOfDiagnosisISODate = list(
    description = 'ISO date of diagnosis',
    type = 'date',
    defaultValue = as.Date(NA),
    restrictedValues = as.Date(NA)
  ),
  YearOfArrivalISODate = list(
    description = 'ISO date of arrival',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  ArtDateISODate = list(
    description = 'ISO date of art',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  CD4LatestDateISODate = list(
    description = 'ISO date of latest CD4',
    type = 'date',
    defaultValue = as.Date(NA)
  ),
  VLLatestDateISODate = list(
    description = 'ISO date of latest VL',
    type = 'date',
    defaultValue = as.Date(NA)
  )
)
