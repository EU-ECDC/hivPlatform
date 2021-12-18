PrepareMigrantData <- function(
  data,
  seed = NULL
) {
  minDate <- as.Date('1980-01-01')
  maxDate <- as.Date('3000-01-01')
  yearDays <- 365.25

  # Pre-process data -------------------------------------------------------------------------------
  colNames <- c(
    'Imputation', 'RecordId', 'Gender', 'Transmission', 'Age', 'DateOfArrival',
    'MigrantRegionOfOrigin', 'DateOfHIVDiagnosis', 'AcuteInfection', 'FirstCD4Count',
    'LatestCD4Count', 'DateOfFirstCD4Count', 'DateOfLatestCD4Count', 'LatestVLCount',
    'DateOfLatestVLCount', 'DateOfArt', 'DateOfAIDSDiagnosis', 'YearOfHIVDiagnosis'
  )
  data <- data[, ..colNames]

  PrintH2('Checking data structure validity')
  columnSpecs <- GetListObject(
    GetSystemFile('referenceData/requiredColumns.R'),
    includeFileName = FALSE
  )
  columnSpecs[['Imputation']] <- list(
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
  data[is.na(MigrantRegionOfOrigin), MigrantRegionOfOrigin := 'UNK']
  data[, Transmission := as.character(Transmission)]
  data[is.na(Transmission), Transmission := 'UNK']
  data[, Gender := as.character(Gender)]
  data[is.na(Gender), Gender := 'UNK']

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
  data[, Excluded := '']
  data[
    Excluded == '' & MigrantRegionOfOrigin == 'UNK',
    Excluded := 'Migrant region of origin is missing'
  ]
  data[
    Excluded == '' & MigrantRegionOfOrigin == 'REPCOUNTRY',
    Excluded := 'Not considered a migrant, because region of origin is the reporting country' # nolint
  ]
  data[
    Excluded == '' & !(MigrantRegionOfOrigin %chin% c('AFRICA', 'EUROPE', 'ASIA', 'CARIBBEAN-LATIN AMERICA')), # nolint
    Excluded := 'Migrant region of origin is not one of "AFRICA", "EUROPE", "ASIA", "CARIBBEAN-LATIN AMERICA"' # nolint
  ]
  data[
    Excluded == '' & !(Gender %chin% c('F', 'M')),
    Excluded := 'Gender is not either "F" or "M"'
  ]
  data[
    Excluded == '' & !(Transmission %chin% c('MSM', 'IDU', 'HETERO', 'TRANSFU')),
    Excluded := 'Transmission is not of mode "MSM", "IDU", "HETERO" or "TRANSFU"'
  ]
  data[
    Excluded == '' & DateOfArrival < DateOfBirth,
    Excluded := 'Date of arrival is before date of birth'
  ]
  data[
    Excluded == '' & is.na(Age),
    Excluded := 'Age is missing'
  ]
  data[
    Excluded == '' & !is.na(Age) & Age <= 15,
    Excluded := 'Age is below 16'
  ]
  data[
    Excluded == '' & is.na(U),
    Excluded := 'Number of years from risk onset to HIV diagnosis is missing'
  ]
  data[
    Excluded == '' & !is.na(U) & U <= 0,
    Excluded := 'Date of HIV diagnosis is before risk onset'
  ]

  # Impute date of arrival -------------------------------------------------------------------------
  data[, YearsToArrival := as.numeric(DateOfArrival - DateOfBirth) / yearDays]
  data[, PropBeforeArrival := YearsToArrival / Age]
  data[, ImputeData :=
    Excluded == '' &
      (is.na(PropBeforeArrival) | between(PropBeforeArrival, 0, 1)) &
      (Gender != 'UNK' & !is.na(Age) & !is.na(FirstCD4Count) & !is.na(YearOfHIVDiagnosis))
  ]

  # Recreate factors with required levels
  data[, ':='(
    Imputation = factor(Imputation),
    Gender = factor(
      Gender,
      levels = c('F', 'M'),
      labels = c('Female', 'Male')
    ),
    MigrantRegionOfOrigin = factor(
      MigrantRegionOfOrigin,
      levels = c('AFRICA', 'EUROPE', 'ASIA', 'CARIBBEAN-LATIN AMERICA'),
      labels = c('Africa', 'Europe', 'Asia', 'Carribean/Latin America')
    ),
    Transmission = factor(
      Transmission,
      levels = c('MSM', 'IDU', 'HETERO', 'TRANSFU'),
      labels = c('MSM', 'IDU', 'MSW', 'Other/Unknown')
    ),
    YearOfHIVDiagnosis = as.factor(YearOfHIVDiagnosis)
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
  data[, PropBeforeArrivalImputed := exp(PropBeforeArrivalLogit) / (1 + exp(PropBeforeArrivalLogit))] # nolint
  data[, DateOfArrivalImputed := DateOfBirth + (Age * PropBeforeArrivalImputed) * yearDays]

  # Print statistics
  imputeStat <- data[,
    .(
      CountBeforeImputation = sum(ImputeData & !is.na(DateOfArrival)),
      CountAfterImputation = sum(ImputeData & !is.na(DateOfArrivalImputed)),
      CountImputed = sum(ImputeData & !is.na(DateOfArrivalImputed)) - sum(ImputeData & !is.na(DateOfArrival)), # nolint
      CountTotal = .N
    ),
    by = .(Imputation)
  ]

  PrintH1('Counts of imputed dates of arrival')
  print(knitr::kable(
    imputeStat,
    format = 'simple',
    escape = FALSE,
    col.names = c('Imputation', 'Before imputation', 'After imputation', 'Imputed', 'Total')
  ))

  data[, ':='(
    DateOfArrival = DateOfArrivalImputed,
    DateOfArrivalImputed = NULL
  )]

  # ------------------------------------------------------------------------------------------------
  data[Excluded == '' & is.na(DateOfArrival), Excluded := 'Date of arrival is missing']

  missStat <- rbind(
    data[Excluded != '', .(Count = .N), by = .(Excluded)][order(-Count)],
    data[, .(Excluded = 'Total excluded', Count = sum(Excluded != ''))],
    data[, .(Excluded = 'Total used in estimation', Count = sum(Excluded == ''))]
  )

  PrintH1('Statistics of exclusions')
  print(knitr::kable(
    missStat,
    format = 'simple',
    escape = FALSE
  ))

  # Process data -----------------------------------------------------------------------------------
  base <- data[Excluded == '']

  # Generate unique identifier
  base[, ':='(
    UniqueId = rleid(Imputation, RecordId),
    Ord = rowid(Imputation, RecordId)
  )]

  # Years since 1/1/1980
  base[, Calendar := as.numeric(DateOfHIVDiagnosis - minDate) / 365.25]

  # Years from migration to HIV diagosis
  base[, Mig := as.numeric(DateOfHIVDiagnosis - DateOfArrival) / 365.25]

  base[, KnownPrePost := fcase(Mig < 0, 'Pre', Mig > U, 'Post', default = 'Unknown')]

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
    Only := fcase(
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

  # Cases with no pre-ART/AIDS markers (CD4, VL) at all
  baseAIDS <- base[!(UniqueId %chin% baseCD4VL$UniqueId)]
  baseAIDS[, DTime := as.numeric(DateOfAIDSDiagnosis - DateOfHIVDiagnosis) / 365.25]
  baseAIDS[DTime < 0, DTime := 0]

  # Diagnosis artifacts
  countDistrData <- rbind(
    baseCD4VL[, .(DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin)],
    baseAIDS[, .(DateOfArrival, DateOfHIVDiagnosis, MigrantRegionOfOrigin)]
  )
  if (nrow(countDistrData) > 0) {
    countDistr <- countDistrData[,
      .(Count = .N),
      keyby = .(
        YearOfArrival = year(DateOfArrival),
        YearOfDiagnosis = year(DateOfHIVDiagnosis),
        MigrantRegionOfOrigin
      )
    ]

    regionDistr <- dcast(
      countDistr,
      YearOfArrival ~ MigrantRegionOfOrigin,
      value.var = 'Count',
      fun.aggregate = sum,
      fill = 0
    )

    migrRegions <- levels(countDistr$MigrantRegionOfOrigin)
    yodDistr <- setNames(lapply(
      migrRegions,
      function(migrRegion) {
        dcast(
          countDistr[MigrantRegionOfOrigin == migrRegion],
          YearOfArrival ~ YearOfDiagnosis,
          value.var = 'Count',
          fun.aggregate = sum,
          fill = 0
        )
      }
    ), migrRegions)
  } else {
    regionDistr <- NULL
    yodDistr <- NULL
  }

  return(list(
    Data = list(
      CD4VL = baseCD4VL,
      AIDS = baseAIDS
    ),
    Stats = list(
      Missingness = missStat,
      Imputation = imputeStat,
      RegionDistr = regionDistr,
      YODDistr = ConvertObjToJSON(yodDistr)
    )
  ))
}
