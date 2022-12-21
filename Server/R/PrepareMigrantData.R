#' PrepareMigrantData
#'
#' Pre-processes data as input for migrant module
#'
#' @param data data
#' @param seed sees
#'
#' @return list
#'
#' @examples
#' \dontrun{
#' PrepareMigrantData(data, seed)
#' }
#'
#' @export
PrepareMigrantData <- function(
  data,
  seed = NULL
) {
  minDate <- as.Date('1980-01-01')
  maxDate <- as.Date('3000-01-01')
  yearDays <- 365.25

  # Pre-process data -------------------------------------------------------------------------------
  colNames <- c(
    'Imputation', 'RecordId', 'UniqueId', 'Gender', 'Transmission', 'Age', 'DateOfArrival',
    'HIVStatus', 'MigrantRegionOfOrigin', 'DateOfHIVDiagnosis', 'AcuteInfection', 'FirstCD4Count',
    'LatestCD4Count', 'DateOfFirstCD4Count', 'DateOfLatestCD4Count', 'LatestVLCount',
    'DateOfLatestVLCount', 'DateOfArt', 'DateOfAIDSDiagnosis', 'YearOfHIVDiagnosis'
  )
  data <- data[FinalData == TRUE, ..colNames]

  PrintH1('Checking data structure validity')
  columnSpecs <- GetListObject(
    GetSystemFile('referenceData/requiredColumns.R'),
    includeFileName = FALSE
  )
  columnSpecs[['UniqueId']] <- list(
    type = 'integer',
    defaultValue = NA_integer_
  )
  columnSpecs[['MigrantRegionOfOrigin']] <- list(
    type = 'character',
    defaultValue = NA_character_
  )
  dataStructValidity <- GetInputDataValidityStatus(data, columnSpecs[colNames])
  if (dataStructValidity$Valid) {
    PrintAlert('Data valid', type = 'success')
  } else {
    PrintAlert('Data invalid', type = 'danger')
  }

  # Replace NA with 'UNK'
  data[is.na(AcuteInfection), AcuteInfection := 'UNK']
  data[, MigrantRegionOfOrigin := as.character(MigrantRegionOfOrigin)]
  data[is.na(MigrantRegionOfOrigin), MigrantRegionOfOrigin := 'UNK']
  data[, Transmission := as.character(Transmission)]
  data[is.na(Transmission), Transmission := 'UNK']
  data[, Gender := as.character(Gender)]
  data[is.na(Gender), Gender := 'UNK']
  data[is.na(HIVStatus), HIVStatus := 'UNK']

  # Group Caribbean/Latin America with Other for processing
  data[MigrantRegionOfOrigin %chin% c('CARIBBEAN-LATIN AMERICA'), MigrantRegionOfOrigin := 'OTHER']

  # Add DateOfBirth
  data[, DateOfBirth := DateOfHIVDiagnosis - Age * yearDays]

  # Generate at risk date
  data[, AtRiskDate := pmax(DateOfBirth + 10 * yearDays, minDate)]
  data[
    AcuteInfection != 'UNK',
    AtRiskDate := pmax(AtRiskDate, DateOfHIVDiagnosis - 0.25 * yearDays)
  ]

  # Years from risk onset to HIV diagnosis
  data[, U := as.numeric(DateOfHIVDiagnosis - AtRiskDate) / 365.25]

  # Initialize filters -----------------------------------------------------------------------------
  data[, Excluded := factor(
    NA_character_,
    levels = c(
      'Migrant region of origin is missing',
      'Not considered a migrant, because region of origin is the reporting country',
      'Migrant region of origin is not one of "AFRICA", "EUROPE-NORTH AMERICA", "ASIA", "OTHER"',
      'Gender is not either "F" or "M"',
      'Transmission is missing',
      'Transmission is not of mode "MSM", "IDU", "HETERO" or "TRANSFU"',
      'Date of arrival is before date of birth',
      'Age is missing',
      'Age is below 16',
      'Number of years from risk onset to HIV diagnosis is missing',
      'Date of HIV diagnosis is before risk onset',
      'Date of arrival is missing'
    )
  )]
  data[
    is.na(Excluded) & MigrantRegionOfOrigin == 'UNK',
    Excluded := 'Migrant region of origin is missing'
  ]
  data[
    is.na(Excluded) & MigrantRegionOfOrigin == 'REPCOUNTRY',
    Excluded := 'Not considered a migrant, because region of origin is the reporting country' # nolint
  ]
  data[
    is.na(Excluded) & !(MigrantRegionOfOrigin %chin% c('AFRICA', 'EUROPE-NORTH AMERICA', 'ASIA', 'OTHER')), # nolint
    Excluded := 'Migrant region of origin is not one of "AFRICA", "EUROPE-NORTH AMERICA", "ASIA", "CARIBBEAN-LATIN AMERICA", "OTHER"' # nolint
  ]
  data[
    is.na(Excluded) & !(Gender %chin% c('F', 'M')),
    Excluded := 'Gender is not either "F" or "M"'
  ]
  data[
    is.na(Excluded) & Transmission == 'UNK',
    Excluded := 'Transmission is missing'
  ]
  data[
    is.na(Excluded) & !(Transmission %chin% c('MSM', 'IDU', 'HETERO', 'TRANSFU')),
    Excluded := 'Transmission is not of mode "MSM", "IDU", "HETERO" or "TRANSFU"'
  ]
  data[
    is.na(Excluded) & DateOfArrival < DateOfBirth,
    Excluded := 'Date of arrival is before date of birth'
  ]
  data[
    is.na(Excluded) & is.na(Age),
    Excluded := 'Age is missing'
  ]
  data[
    is.na(Excluded) & !is.na(Age) & Age <= 15,
    Excluded := 'Age is below 16'
  ]
  data[
    is.na(Excluded) & is.na(U),
    Excluded := 'Number of years from risk onset to HIV diagnosis is missing'
  ]
  data[
    is.na(Excluded) & !is.na(U) & U <= 0,
    Excluded := 'Date of HIV diagnosis is before risk onset'
  ]

  # Impute date of arrival -------------------------------------------------------------------------
  data[, YearsToArrival := as.numeric(DateOfArrival - DateOfBirth) / yearDays]
  data[, PropBeforeArrival := YearsToArrival / Age]
  data[, ImputeData :=
    is.na(Excluded) &
      (is.na(PropBeforeArrival) | between(PropBeforeArrival, 0, 1)) &
      (Gender != 'UNK' & !is.na(Age) & !is.na(FirstCD4Count) & !is.na(YearOfHIVDiagnosis))
  ]

  # Recreate factors with required levels
  data[, ':='(
    Gender = factor(Gender, levels = c('F', 'M')),
    MigrantRegionOfOrigin = factor(
      MigrantRegionOfOrigin,
      levels = c('AFRICA', 'EUROPE-NORTH AMERICA', 'ASIA', 'OTHER')
    ),
    Transmission = factor(
      Transmission,
      levels = c('MSM', 'IDU', 'HETERO', 'TRANSFU')
    ),
    YearOfHIVDiagnosis = as.factor(YearOfHIVDiagnosis),
    DateOfArrivalImputed = DateOfArrival
  )]

  # Get data to be imputed and a sample of full data for the imputation
  imputeData <- data[
    ImputeData == TRUE,
    .(
      Imputation,
      Gender,
      MigrantRegionOfOrigin,
      Transmission,
      YearOfHIVDiagnosis,
      Age,
      FirstCD4Count,
      PropBeforeArrival
    )
  ]

  if (nrow(imputeData) > 0) {
    selNotNA <- imputeData[, !is.na(PropBeforeArrival)]
    # Prepare logit transformation
    imputeData[selNotNA & between(PropBeforeArrival, 0, 0.00001), PropBeforeArrival := 0.00001]
    imputeData[selNotNA & between(PropBeforeArrival, 0.99999, 1), PropBeforeArrival := 0.99999]
    imputeData[selNotNA, PropBeforeArrivalLogit := log(PropBeforeArrival / (1 - PropBeforeArrival))]
    imputeData[, PropBeforeArrival := NULL]
    imputeWhere <- data.table(
      Imputation = FALSE,
      Gender = FALSE,
      MigrantRegionOfOrigin = FALSE,
      Transmission = FALSE,
      YearOfHIVDiagnosis = FALSE,
      Age = FALSE,
      FirstCD4Count = FALSE,
      PropBeforeArrivalLogit = !selNotNA
    )

    set.seed(seed)
    miceImputation <- suppressWarnings(mice::mice(
      imputeData,
      where = imputeWhere,
      m = 1,
      maxit = 5,
      printFlag = FALSE
    ))
    imputeData <- setDT(mice::complete(miceImputation, action = 1))

    data[ImputeData == TRUE, PropBeforeArrivalLogit := imputeData$PropBeforeArrivalLogit]
    data[ImputeData == TRUE, PropBeforeArrivalImputed := exp(PropBeforeArrivalLogit) / (1 + exp(PropBeforeArrivalLogit))] # nolint
    data[ImputeData == TRUE, DateOfArrivalImputed := DateOfBirth + (Age * PropBeforeArrivalImputed) * yearDays] # nolint
  }

  imputeStat <- data[,
    .(
      CountBeforeImputation = sum(!is.na(DateOfArrival)),
      CountAfterImputation = sum(!is.na(DateOfArrivalImputed)),
      CountImputed = sum(!is.na(DateOfArrivalImputed)) - sum(!is.na(DateOfArrival)),
      CountTotal = .N
    ),
    by = .(Imputation)
  ]

  data[, ':='(
    DateOfArrival = DateOfArrivalImputed,
    DateOfArrivalImputed = NULL
  )]

  # ------------------------------------------------------------------------------------------------
  data[is.na(Excluded) & is.na(DateOfArrival), Excluded := 'Date of arrival is missing']

  missLevels <- data[, .(Excluded = levels(Excluded), Count = 0, IsTotalRow = FALSE)]
  missLevels[
    data[!is.na(Excluded), .(Count = .N), by = .(Excluded)],
    Count := i.Count,
    on = .(Excluded)
  ]

  missStat <- rbind(
    missLevels,
    data[, .(Excluded = 'Total excluded', Count = sum(!is.na(Excluded)), IsTotalRow = TRUE)],
    data[, .(Excluded = 'Total used in estimation', Count = sum(is.na(Excluded)), IsTotalRow = TRUE)] # nolint
  )

  # Years since 1/1/1980
  data[, Calendar := as.numeric(DateOfHIVDiagnosis - minDate) / 365.25]

  # Years from migration to HIV diagosis
  data[, Mig := as.numeric(DateOfHIVDiagnosis - DateOfArrival) / 365.25]

  data[is.na(Excluded), KnownPrePost := data.table::fcase(
    Mig < 0 | HIVStatus == 'PREVPOS', 'Pre',
    Mig >= U, 'Post',
    default = 'Unknown'
  )]

  # Process data -----------------------------------------------------------------------------------
  base <- data[is.na(Excluded)]

  # CD4 dataset
  if (nrow(base) > 0) {
    cd4 <- base[, .(
      UniqueId,
      YVar_1 = FirstCD4Count,
      YVar_2 = LatestCD4Count,
      DateOfExam_1 = pmax(DateOfHIVDiagnosis, DateOfFirstCD4Count, na.rm = TRUE),
      DateOfExam_2 = DateOfLatestCD4Count,
      Indi = 'CD4'
    )]
  } else {
    cd4 <- data.table(
      UniqueId = integer(),
      YVar_1 = numeric(),
      YVar_2 = numeric(),
      DateOfExam_1 = as.Date(integer()),
      DateOfExam_2 = as.Date(integer()),
      Indi = character()
    )
  }
  cd4 <- melt(
    cd4,
    measure.vars = patterns('^DateOfExam', '^YVar'),
    value.name = c('DateOfExam', 'YVar'),
    variable.name = 'Time'
  )
  cd4[, Time := NULL]

  # VL dataset
  if (nrow(base) > 0) {
    rna <- base[, .(
      UniqueId,
      YVar = LatestVLCount,
      DateOfExam = DateOfLatestVLCount,
      Indi = 'RNA'
    )]
  } else {
    rna <- data.table(
      UniqueId = integer(),
      YVar = numeric(),
      DateOfExam = as.Date(integer()),
      Indi = character()
    )
  }
  rna[!is.na(YVar) & YVar == 0, YVar := 25]

  # Combine both markers
  cd4VL <- rbind(cd4, rna, use.names = TRUE)

  # Merge markers with base
  baseCD4VL <- merge(cd4VL, base, by = c('UniqueId'))
  # Keep observations prior to ART initiation and AIDS onset
  baseCD4VL <- baseCD4VL[
    !is.na(DateOfExam) &
      DateOfExam <= na.replace(DateOfArt, maxDate) &
      DateOfExam <= na.replace(DateOfAIDSDiagnosis, maxDate)
  ]

  # Exlude negative times
  baseCD4VL[, DTime := as.numeric(DateOfExam - DateOfHIVDiagnosis) / 365.25]
  baseCD4VL <- baseCD4VL[DTime >= -15 / 365.25]
  baseCD4VL[DTime < 0, DTime := 0]

  # Indicators of a CD4 or VL measurement
  baseCD4VL[, ':='(
    Consc = as.integer(Indi == 'CD4'),
    Consr = as.integer(Indi == 'RNA')
  )]
  baseCD4VL[,
    Only := data.table::fcase(
      any(Indi == 'CD4') & any(Indi == 'RNA'), 'Both',
      any(Indi == 'CD4') & !any(Indi == 'RNA'), 'CD4 only',
      !any(Indi == 'CD4') & any(Indi == 'RNA'), 'VL only'
    ),
    by = .(UniqueId)
  ]

  # Transform CD4 and VL
  baseCD4VL[Consc == 1, YVar := sqrt(YVar)]
  baseCD4VL[Consr == 1, YVar := log10(YVar)]

  # Times of measurements
  baseCD4VL[, ':='(
    CobsTime = DTime * Consc,
    RobsTime = DTime * (1 - Consc),
    RLogObsTime2 = log(DTime + 0.013) * (1 - Consc)
  )]

  # Add unique identifier within the UniqueId
  baseCD4VL[, Ord := rowid(UniqueId)]

  # Cases with no pre-ART/AIDS markers (CD4, VL) at all
  baseAIDS <- base[!(UniqueId %chin% baseCD4VL$UniqueId)]
  baseAIDS[, DTime := as.numeric(DateOfAIDSDiagnosis - DateOfHIVDiagnosis) / 365.25]
  baseAIDS[DTime < 0, DTime := 0]

  # Diagnosis artifacts
  countDistrData <- data.table(
    Imputation = integer(),
    DateOfArrival = as.Date(integer()),
    DateOfHIVDiagnosis = as.Date(integer()),
    MigrantRegionOfOrigin = as.factor(character())
  )
  if (nrow(baseCD4VL) > 0) {
    countDistrData <- rbind(
      countDistrData,
      baseCD4VL[, .(Imputation, DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin)]
    )
  }
  if (nrow(baseAIDS) > 0) {
    countDistrData <- rbind(
      countDistrData,
      baseAIDS[, .(Imputation, DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin)]
    )
  }
  if (nrow(baseCD4VL) > 0) {
    countDistrData <- rbind(
      countDistrData,
      baseCD4VL[, .(Imputation, DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin = 'ALL')]
    )
  }
  if (nrow(baseAIDS) > 0) {
    countDistrData <- rbind(
      countDistrData,
      baseAIDS[, .(Imputation, DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin = 'ALL')]
    )
  }

  if (nrow(countDistrData) > 0) {
    countDistr <- countDistrData[,
      .(Count = .N),
      keyby = .(
        Imputation,
        YearOfArrival = year(DateOfArrival),
        YearOfDiagnosis = year(DateOfHIVDiagnosis),
        MigrantRegionOfOrigin
      )
    ]
    meanCountDistr <- countDistr[,
      .(Count = mean(Count)),
      keyby = .(YearOfArrival, YearOfDiagnosis, MigrantRegionOfOrigin)
    ]
    migrRegions <- levels(meanCountDistr$MigrantRegionOfOrigin)

    # Number of cases by Year of Arrival and Region For Migration Module
    regionDistr <- dcast(
      meanCountDistr[MigrantRegionOfOrigin != 'ALL'],
      YearOfArrival ~ MigrantRegionOfOrigin,
      value.var = 'Count',
      fun.aggregate = sum,
      fill = 0
    )

    # Number of cases by the Year of Arrival and Year of Diagnosis
    allYODDistr <- meanCountDistr[MigrantRegionOfOrigin == 'ALL', .(YearOfArrival, YearOfDiagnosis)]
    yodDistr <- setNames(lapply(
      migrRegions,
      function(migrRegion) {
        dt <- meanCountDistr[MigrantRegionOfOrigin == migrRegion]
        dt <- dt[
          allYODDistr,
          on = .(YearOfArrival, YearOfDiagnosis)
        ]
        dcast(
          dt,
          YearOfArrival ~ YearOfDiagnosis,
          value.var = 'Count',
          fun.aggregate = sum,
          fill = 0,
          na.rm = TRUE
        )
      }
    ), migrRegions)
  } else {
    regionDistr <- NULL
    yodDistr <- NULL
  }

  return(list(
    Data = list(
      Input = data[, .(UniqueId, DateOfArrival, Excluded, KnownPrePost)],
      CD4VL = baseCD4VL,
      AIDS = baseAIDS
    ),
    Stats = list(
      Missingness = missStat,
      Imputation = imputeStat,
      RegionDistr = GetHeatMapChartData(regionDistr),
      YODDistr = lapply(yodDistr, GetHeatMapChartData, titleX = 'Year of Diagnosis')
    )
  ))
}
