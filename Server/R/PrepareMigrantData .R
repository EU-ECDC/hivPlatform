PrepareMigrantData <- function(
  data
) {
  # Reference data
  regionMapping <- data.table(
    FullRegionOfOrigin = c(
      'CENTEUR', 'EASTEUR', 'WESTEUR', 'EUROPE', 'NORTHAM',
      'NORTHAFRMIDEAST', 'SUBAFR',
      'SOUTHASIA', 'EASTASIAPAC'
    ),
    GroupedRegion = factor(c(
      'Europe', 'Europe', 'Europe', 'Europe', 'Europe',
      'Africa', 'Africa',
      'Asia', 'Asia'
    ), levels = c('Europe', 'Africa', 'Asia', 'Unknown'))
  )

  # Filter
  data <- data[
    Transmission %in% c('MSM', 'IDU', 'HETERO') &
    !is.na(Age) & Age > 10 &
    !is.na(DateOfArrival) &
    !is.na(FullRegionOfOrigin)
  ]

  # Generate mode of infection
  data[, Mode := NA_character_]
  data[Transmission == 'MSM', Mode := 'MSM']
  data[Transmission == 'IDU', Mode := 'IDU']
  data[Transmission == 'HETERO', Mode := 'MSW']
  data[is.na(Transmission), Mode := 'Other/Unknown']
  data[, Mode := factor(Mode, levels = c('MSM', 'IDU', 'MSW', 'Other/Unknown'))]

  # Add grouped region of origin
  data[
    regionMapping,
    GroupedRegion := i.GroupedRegion,
    on = .(FullRegionOfOrigin)
  ]
  data[is.na(GroupedRegion), GroupedRegion := 'Unknown']

  # Years since 1/1/1980
  data[, Calendar := as.numeric(DateOfHIVDiagnosis - as.Date('1980-1-1')) / 365.25]

  # Generate at risk date
  data[, AtRiskDate := pmax(DateOfHIVDiagnosis - Age * 365.25 + 10 * 365.25, as.Date('1980-1-1'))]
  data[!is.na(AcuteInfection), AtRiskDate := pmax(AtRiskDate, DateOfHIVDiagnosis - 0.5 * 365.25)]

  # Years from risk onset to HIV diagnosis
  data[, U := as.numeric(DateOfHIVDiagnosis - AtRiskDate) / 365.25]
  # There should not be any negative U's
  data <- data[U > 0]

  # Years from migration to HIV diagosis
  data[, Mig := as.numeric(DateOfHIVDiagnosis - DateOfArrival) / 365.25]

  data[, KnownPrePost := fcase(Mig < 0, 'Pre', Mig > U, 'Post', default = 'Unknown')]

  # Base dataset
  base <- data[, .(
    Imputation, RecordId, Gender, Age, GroupedRegion, Mode, Calendar, Art, DateOfArt,
    DateOfHIVDiagnosis, DateOfAIDSDiagnosis, DateOfArrival, AtRiskDate, U, Mig, KnownPrePost
  )]

  # CD4 dataset
  cd4 <- data[, .(
    Imputation,
    RecordId,
    YVar_1 = FirstCD4Count,
    YVar_2 = LatestCD4Count,
    DateOfExam_1 = pmax(DateOfHIVDiagnosis, DateOfFirstCD4Count, na.rm = TRUE),
    DateOfExam_2 = DateOfLatestCD4Count,
    Indi = 'CD4'
  )]
  cd4 <- melt(
    cd4,
    measure.vars = patterns('^DateOfExam', '^YVar'),
    value.name = c('DateOfExam', 'YVar'),
    variable.name = 'Time'
  )
  cd4[, Time := NULL]

  # VL dataset
  rna <- data[, .(
    Imputation,
    RecordId,
    YVar = LatestVLCount,
    DateOfExam = DateOfLatestVLCount,
    Indi = 'RNA'
  )]
  rna[!is.na(YVar) & YVar == 0, YVar := 25]

  # Combine both markers
  cd4VL <- rbind(cd4, rna, use.names = TRUE)

  # Merge markers with base
  baseCD4VL <- merge(cd4VL, base, by = c('Imputation', 'RecordId'))
  # Keep observations prior to ART initiation and AIDS onset
  baseCD4VL <- baseCD4VL[
    !is.na(DateOfExam) &
      DateOfExam <= na.replace(DateOfArt, as.Date('3000-01-01')) &
      DateOfExam <= na.replace(DateOfAIDSDiagnosis, as.Date('3000-01-01'))
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

  # Transform cd4 and vl
  baseCD4VL[Consc == 1, YVar := sqrt(YVar)]
  baseCD4VL[Consr == 1, YVar := log10(YVar)]

  # Times of measurments
  baseCD4VL[, ':='(
    CobsTime = DTime * Consc,
    RobsTime = DTime * (1 - Consc),
    RLogObsTime2 = log(DTime + 0.013) * (1 - Consc)
  )]

  baseCD4VL[, ':='(SumConsc = sum(Consc), SumConsr = sum(Consr)), by = .(Imputation, RecordId)]
  baseCD4VL[, Only := fcase(
    SumConsc > 0 & SumConsr > 0, 'Both',
    SumConsc > 0 & SumConsr == 0, 'CD4 only',
    SumConsc == 0 & SumConsr > 0, 'VL only'
  )]

  # Cases with no pre-ART/AIDS markers (CD4, VL) at all
  baseAIDS <- base[!(RecordId %chin% baseCD4VL$RecordId)]
  baseAIDS[, DTime := as.numeric(DateOfAIDSDiagnosis - DateOfHIVDiagnosis) / 365.25]
  baseAIDS[DTime < 0, DTime := 0]

  return(list(
    CD4VL = baseCD4VL,
    AIDS = baseAIDS
  ))
}
