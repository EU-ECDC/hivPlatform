Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')

## A. Case-based data only =============================================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())
# Optional
appMgr$CaseMgr$SetFilters(filters = list(
  DiagYear = list(
    ApplyInAdjustments = TRUE,
    MinYear = 1980,
    MaxYear = 2019
  ),
  NotifQuarter = list(
    ApplyInAdjustments = FALSE,
    MinYear = 1995.375,
    MaxYear = 2020.375
  )
))

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- hivPlatform::GetAdjustmentSpecs(
  c('Multiple Imputation using Chained Equations - MICE')
)
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

# STEP 4 - Create adjusted case-based data report --------------------------------------------------
appMgr$CreateReport(
  reportSpec = list(
    name = 'Main Report',
    reportingDelay = FALSE,
    smoothing = FALSE,
    cd4ConfInt = FALSE
  )
)

reportFileName <- hivPlatform::RenderReportToFile(
  reportFilePath = hivPlatform::GetReportFileNames()['Main Report'],
  format = 'pdf_document',
  params = appMgr$ReportArtifacts
)
browseURL(reportFileName)

# STEP 5 - Fit the HIV model to the case-based data ------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  popCombination = list(
    Case = NULL, # No filter = all data
    Aggr = c()
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 6 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'NON-PARAMETRIC')

# Bootstrap data
bootData <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult))
)
bootData <- data.table::rbindlist(lapply(bootData, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$BootIteration$Imputation,
    BootIteration = res$BootIteration$Iteration,
    Attempt = res$BootIteration$Attempt
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  bootData,
  c('DataSet', 'BootIteration', 'Attempt')
)

# Bootstrap stats
bootStats <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)

## B. Aggregated data only =============================================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$AggrMgr$ReadData(hivPlatform::GetSystemFile('testData', 'test_-_2_populations.zip'))

# STEP 2 - Fit the HIV model -----------------------------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  popCombination = list(
    Case = NULL,
    Aggr = appMgr$AggrMgr$PopulationNames
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 3 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')

# Bootstrap data
bootData <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult))
)
bootData <- data.table::rbindlist(lapply(bootData, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$BootIteration$Imputation,
    BootIteration = res$BootIteration$Iteration,
    Attempt = res$BootIteration$Attempt
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  bootData,
  c('DataSet', 'BootIteration', 'Attempt')
)

# Bootstrap stats
bootStats <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)


## C. Combined case-based and aggregated data ==========================================================================
appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData(filePath = hivPlatform::GetSystemFile('testData', 'dummy_miss1.zip'))
appMgr$AggrMgr$ReadData(hivPlatform::GetSystemFile('testData', 'test_-_2_populations.zip'))

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping = list())

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
appMgr$CaseMgr$RunAdjustments(hivPlatform::GetAdjustmentSpecs(
  c('Multiple Imputation using Chained Equations - MICE')
))

# STEP 3 - Set aggregated data selection -----------------------------------------------------------
aggrDataSelection <- data.table::data.table(
  Name = c(
    'Dead', 'AIDS', 'HIV', 'HIVAIDS', 'HIV_CD4_1', 'HIV_CD4_2', 'HIV_CD4_3', 'HIV_CD4_4'
  ),
  Use = c(TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
  MinYear = c(1980, 1980, 1980, 1980, 1980, 1980, 1980, 1980),
  MaxYear = c(2017, 2016, 2016, 2016, 2016, 2016, 2016, 2016)
)
appMgr$HIVModelMgr$SetAggrFilters(aggrDataSelection)

# STEP 2 - Fit the HIV model -----------------------------------------------------------------------
appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = 1980,
    ModelMaxYear = 2016,
    FitPosMinYear = 1979,
    FitPosMaxYear = 1979,
    FitPosCD4MinYear = 1984,
    FitPosCD4MaxYear = 2016,
    FitAIDSMinYear = 1980,
    FitAIDSMaxYear = 1995,
    FitAIDSPosMinYear = 1985,
    FitAIDSPosMaxYear = 2016,
    FullData = TRUE,
    ModelNoKnots = 4,
    StartIncZero = TRUE,
    MaxIncCorr = TRUE,
    FitDistribution = 'POISSON',
    Delta4Fac = 0,
    Country = 'OTHER'
  ),
  # Select only case-based data for "Gender" = "M" (Male) and population "pop_0" from aggegated data
  # set
  popCombination = list(
    Case = list(list(Variables = c('Gender'), Values = c('M'))),
    CaseAbbr = c('M [G]'), # This is used only for printing
    Aggr = c('pop_0')
  )
)

# Detailed HIV Model main fit results
data <- data.table::rbindlist(lapply(names(appMgr$HIVModelMgr$MainFitResult), function(iter) {
  dt <- appMgr$HIVModelMgr$MainFitResult[[iter]]$Results$MainOutputs
  dt[, ':='(
    Imputation = iter,
    Run = NULL
  )]
  data.table::setcolorder(dt, 'Imputation')
}))

# STEP 3 - Run bootstrap to get the confidence bounds estimates ------------------------------------
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'PARAMETRIC')
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 20, bsType = 'NON-PARAMETRIC')

# Bootstrap data
bootData <- Filter(
  function(item) item$Results$Converged,
  Reduce(c, Reduce(c, appMgr$HIVModelMgr$BootstrapFitResult))
)
bootData <- data.table::rbindlist(lapply(bootData, function(res) {
  mainOutputs <- res$Results$MainOutputs
  mainOutputs[, ':='(
    DataSet = res$BootIteration$Imputation,
    BootIteration = res$BootIteration$Iteration,
    Attempt = res$BootIteration$Attempt
  )]
  return(mainOutputs)
}))
data.table::setcolorder(
  bootData,
  c('DataSet', 'BootIteration', 'Attempt')
)

# Bootstrap stats
bootStats <- data.table::rbindlist(appMgr$HIVModelMgr$BootstrapFitStats$MainOutputsStats)


## D. Load state =======================================================================================================
appMgr <- hivPlatform::AppManager$new()
appMgr$LoadState("D:/Downloads/HIVPlatformState_20250320_093049.rds")

parameters <- list(
  Intervals = data.table::fread(
    "
    StartYear EndYear   Jump DiffByCD4 ChangeInInterval
    1980    1984  FALSE     FALSE            FALSE
    1984    1992   TRUE     FALSE            FALSE
    1992    2000   TRUE     FALSE            FALSE
    2000    2008   TRUE     FALSE            FALSE
    2008    2023   TRUE     FALSE            FALSE
    "
  ),
  ModelMinYear = 1980L,
  ModelMaxYear = 2023L,
  FitPosMinYear = 1987L,
  FitPosMaxYear = 1999L,
  FitPosCD4MinYear = 2000L,
  FitPosCD4MaxYear = 2009L,
  FitAIDSMinYear = 1987L,
  FitAIDSMaxYear = 1995L,
  FitAIDSPosMinYear = 1989L,
  FitAIDSPosMaxYear = 2023L
)

# Combination 'All data'
popCombination <- list(Case = NULL, Aggr = appMgr$AggrMgr$PopulationNames)

appMgr$HIVModelMgr$RunMainFit(settings = list(), parameters, popCombination)

appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 3L, bsType = 'NON-PARAMETRIC')


# E. Provide custom attribute mapping ==================================================================================
library(hivPlatform)
appMgr <- AppManager$new()
appMgr$CaseMgr$ReadData(filePath = "D:/Downloads/modelling_norway_fake.csv")

attrMapping <- GetPreliminaryAttributesMapping(appMgr$CaseMgr$OriginalData)
attrMapping$RecordId$origColName <- "loepenummer"
attrMapping$Age$origColName <- 'alder_ar'
attrMapping$Art$origColName <- NULL
attrMapping$Gender$origColName <- "kjonn_navn"
attrMapping$Transmission$origColName <- "smittemate"
attrMapping$FirstCD4Count$origColName <- "cd4"
# attrMapping$HIVStatus$origColName <- "hivstatus"
attrMapping$HIVStatus$origColName <- NULL
attrMapping$CountryOfBirth$origColName <- "country_of_birth_iso_modelling"
attrMapping$DateOfNotification$origColName <- "notification_year"
attrMapping$DateOfHIVDiagnosis$origColName <- "hiv_year"
attrMapping$DateOfAIDSDiagnosis$origColName <- "aids_year"
attrMapping$DateOfDeath$origColName <- "year_dead_outmig_modelling"
attrMapping$DateOfArrival$origColName <- "immigration_year"
appMgr$CaseMgr$ApplyAttributesMapping(attrMapping)

originDistribution <- appMgr$CaseMgr$OriginDistribution
originGrouping <- GetOriginGroupingPreset('REPCOUNTRY + UNK + OTHER', originDistribution)
originGrouping[[1]]$MigrantRegionOfOrigin <- 'REPCOUNTRY'
originGrouping[[2]]$MigrantRegionOfOrigin <- 'UNK'
originGrouping[[3]]$MigrantRegionOfOrigin <- 'OTHER'
appMgr$CaseMgr$ApplyOriginGrouping(originGrouping)

appMgr$CaseMgr$RunMigration()
appMgr$CaseMgr$Data[, .N, keyby = .(HIVStatus, KnownPrePost, ProbPreIsNA =  is.na(ProbPre))]
# Key: <HIVStatus, KnownPrePost, ProbPreIsNA>
#    HIVStatus KnownPrePost ProbPreIsNA     N
#       <char>       <char>      <lgcl> <int>
# 1:      <NA>         <NA>        TRUE  3814
# 2:      <NA>         Post       FALSE    15
# 3:      <NA>          Pre       FALSE   542
# 4:      <NA>      Unknown       FALSE   283
# 5:      <NA>      Unknown        TRUE   487
# 6:   PREVPOS         <NA>        TRUE   472
# 7:   PREVPOS          Pre       FALSE  1275

appMgr$CaseMgr$Data[, .(Percentage = sum(KnownPrePost %in% "Pre") / .N * 100)]
appMgr$CaseMgr$Data[, .(Percentage = sum(ProbPre >= 0.5, na.rm = TRUE))]
#    Percentage
#         <num>
# 1:   26.37921

migrInput <- data.table::copy(appMgr$CaseMgr$MigrationResult$Input$Input)
migrOuput <- data.table::copy(appMgr$CaseMgr$MigrationResult$Output)

migrInput[
  appMgr$CaseMgr$Data,
  HIVStatus := i.HIVStatus,
  on = .(UniqueId)
]
migrOuput[
  appMgr$CaseMgr$Data,
  HIVStatus := i.HIVStatus,
  on = .(UniqueId)
]

migrInput[, sum(!is.na(Excluded))]
migrInput[, .(Count = .N), keyby = list(HIVStatus, Excluded, KnownPrePost)]
# Key: <HIVStatus, Excluded, KnownPrePost>
#     HIVStatus                                                                    Excluded KnownPrePost     N
#        <char>                                                                      <fctr>       <char> <int>
#  1:      <NA>                                                                        <NA>         Post    15
#  2:      <NA>                                                                        <NA>          Pre   542
#  3:      <NA>                                                                        <NA>      Unknown   770
#  4:      <NA>                                         Migrant region of origin is missing         <NA>    51
#  5:      <NA> Not considered a migrant, because region of origin is the reporting country         <NA>  2738
#  6:      <NA>                                                     Transmission is missing         <NA>    71
#  7:      <NA>                                     Date of arrival is before date of birth         <NA>     2
#  8:      <NA>                                                             Age is below 16         <NA>    36
#  9:      <NA>                                                  Date of arrival is missing         <NA>   916
# 10:   PREVPOS                                                                        <NA>          Pre  1275
# 11:   PREVPOS                                         Migrant region of origin is missing         <NA>    25
# 12:   PREVPOS                                                     Transmission is missing         <NA>    60
# 13:   PREVPOS                                                             Age is below 16         <NA>    25
# 14:   PREVPOS                                                  Date of arrival is missing         <NA>   362

migrInput[
  !is.na(KnownPrePost),
  .(
    Count = .N,
    Percentage = .N / nrow(migrInput[!is.na(KnownPrePost)]) * 100
  )
  ,
  keyby = list(KnownPrePost)
]
# Key: <KnownPrePost, Excluded>
#    KnownPrePost Excluded Count Percentage
#          <char>   <fctr> <int>      <num>
# 1:         Post     <NA>    15  0.5764796
# 2:          Pre     <NA>  1817 69.8308993
# 3:      Unknown     <NA>   770 29.5926211

migrOuput[!is.na(ProbPre),
  .(
    Count = .N,
    Percentage = .N / nrow(migrOuput[!is.na(ProbPre)]) * 100
  ),
  keyby = list(HIVStatus, ProbPreIs1 = ProbPre >= 1)
]
# Key: <HIVStatus, ProbPreIs1>
#    HIVStatus ProbPreIs1 Count Percentage
#       <char>     <lgcl> <int>      <num>
# 1:      <NA>         NA   487   23.02600
# 2:      <NA>      FALSE   296   13.99527
# 3:      <NA>       TRUE   544   25.72104
# 4:   PREVPOS       TRUE  1275   60.28369

migrOuput[!is.na(ProbPre) & HIVStatus == "PREVPOS", .N, keyby = .(Mig > 0)]
migrOuput[ProbPre == 1, .N, keyby = .(HIVStatus, Mig > 0)]

meltedMigrOutput <- data.table::melt(
  migrOuput[!is.na(ProbPre)],
  measure.vars = patterns('^SCtoDiag'),
  variable.name = 'Sample',
  value.name = 'SCtoDiag'
)
# meltedMigrOutput[, PreMigrInf := as.integer(SCtoDiag > Mig)]
meltedMigrOutput[, PreMigrInf := ifelse(ProbPre == 1, 1L, as.integer(SCtoDiag > Mig))]
meltedMigrOutput[, .(
  CountPreMigrInf = sum(PreMigrInf),
  Total = .N,
  Percentage = sum(PreMigrInf) / .N * 100
)]
#    CountPreMigrInf  Total Percentage
#              <int>  <int>      <num>
# 1:           66458 105750   62.84444

meltedMigrOutput[,
  .(
    CountPreMigrInf = sum(PreMigrInf),
    Total = .N,
    Percentage = sum(PreMigrInf) / .N * 100
  ),
  keyby = .(HIVStatus)
]
# Key: <HIVStatus>
#    HIVStatus CountPreMigrInf Total Percentage
#       <char>           <int> <int>      <num>
# 1:      <NA>           33208 42000   79.06667
# 2:   PREVPOS           33250 63750   52.15686

meltedMigrOutput[HIVStatus == "PREVPOS", table(PreMigrInf)]
meltedMigrOutput[HIVStatus == "PREVPOS", table(ProbPre)]
meltedMigrOutput[ProbPre == 1, table(PreMigrInf)]
meltedMigrOutput[ProbPre == 1, .N]
meltedMigrOutput[PreMigrInf == 1, .N]

appMgr$CaseMgr$MigrationResult$Artifacts$OutputStats$TableDistr$ALL$Total
# Key: <Total, StrataId>
# Index: <Algorithm>
#     Total StrataId Count MedianPriorProp MeanPriorProp Category PresentCount TotalCount PresentRatio Algorithm PriorProp PriorPropLB PriorPropUB PriorPropRange  PostProp
#    <char>    <int> <num>           <num>         <num>   <char>        <int>      <int>        <num>    <char>     <num>       <num>       <num>          <num>     <num>
# 1:  Total        1  2115               1     0.9165807    Total           50         50            1       GLM 0.6284515   0.6064044   0.6499764     0.04357193 0.3715485
#    PostPropLB PostPropUB PostPropRange
#         <num>      <num>         <num>
# 1:  0.3500236  0.3935956    0.04357193




appMgr <- hivPlatform::AppManager$new()
appMgr$CaseMgr$ReadData(filePath = "D:/Downloads/modelling_norway_fake.csv")

attrMapping <- GetPreliminaryAttributesMapping(appMgr$CaseMgr$OriginalData)
attrMapping$RecordId$origColName <- "loepenummer"
attrMapping$Age$origColName <- 'alder_ar'
attrMapping$Art$origColName <- NULL
attrMapping$Gender$origColName <- "kjonn_navn"
attrMapping$Transmission$origColName <- "smittemate"
attrMapping$FirstCD4Count$origColName <- "cd4"
attrMapping$HIVStatus$origColName <- NULL
attrMapping$CountryOfBirth$origColName <- "country_of_birth_iso_modelling"
attrMapping$DateOfNotification$origColName <- "notification_year"
attrMapping$DateOfHIVDiagnosis$origColName <- "hiv_year"
attrMapping$DateOfAIDSDiagnosis$origColName <- "aids_year"
attrMapping$DateOfDeath$origColName <- "year_dead_outmig_modelling"
attrMapping$DateOfArrival$origColName <- "immigration_year"

appMgr$CaseMgr$ApplyAttributesMapping(attrMapping)

originDistribution <- appMgr$CaseMgr$OriginDistribution
originGrouping <- GetOriginGroupingPreset('REPCOUNTRY + UNK + OTHER', originDistribution)
originGrouping[[1]]$MigrantRegionOfOrigin <- 'REPCOUNTRY'
originGrouping[[2]]$MigrantRegionOfOrigin <- 'UNK'
originGrouping[[3]]$MigrantRegionOfOrigin <- 'OTHER'

appMgr$CaseMgr$ApplyOriginGrouping(originGrouping)

appMgr$CaseMgr$RunMigration()
appMgr$CaseMgr$Data[, .N, keyby = .(KnownPrePost, HIVStatus, Excluded, ProbPreIsNA = is.na(ProbPre))]
# Key: <KnownPrePost, HIVStatus, Excluded, ProbPreIsNA>
#     KnownPrePost HIVStatus                                                                    Excluded ProbPreIsNA     N
#           <char>    <char>                                                                      <fctr>      <lgcl> <int>
#  1:         <NA>      <NA>                                         Migrant region of origin is missing        TRUE    76
#  2:         <NA>      <NA> Not considered a migrant, because region of origin is the reporting country        TRUE  2738
#  3:         <NA>      <NA>                                                     Transmission is missing        TRUE   131
#  4:         <NA>      <NA>                                     Date of arrival is before date of birth        TRUE     2
#  5:         <NA>      <NA>                                                             Age is below 16        TRUE    61
#  6:         <NA>      <NA>                                                  Date of arrival is missing        TRUE  1278
#  7:         Post      <NA>                                                                        <NA>       FALSE    30
#  8:          Pre      <NA>                                                                        <NA>       FALSE  1207
#  9:      Unknown      <NA>                                                                        <NA>       FALSE   613
# 10:      Unknown      <NA>                                                                        <NA>        TRUE   752

appMgr$CaseMgr$Data[, .(Percentage = sum(KnownPrePost %in% "Pre") / .N * 100)]
#    Percentage
#         <num>
# 1:   17.52323

migrInput <- data.table::copy(appMgr$CaseMgr$MigrationResult$Input$Input)
migrOuput <- data.table::copy(appMgr$CaseMgr$MigrationResult$Output)

migrInput[
  appMgr$CaseMgr$Data,
  HIVStatus := i.HIVStatus,
  on = .(UniqueId)
]
migrOuput[
  appMgr$CaseMgr$Data,
  HIVStatus := i.HIVStatus,
  on = .(UniqueId)
]

migrInput[, sum(!is.na(Excluded))]
migrInput[, .(Count = .N), keyby = list(HIVStatus, Excluded, KnownPrePost)]
# Key: <HIVStatus, Excluded, KnownPrePost>
#    HIVStatus                                                                    Excluded KnownPrePost Count
#       <char>                                                                      <fctr>       <char> <int>
# 1:      <NA>                                                                        <NA>         Post    30
# 2:      <NA>                                                                        <NA>          Pre  1207
# 3:      <NA>                                                                        <NA>      Unknown  1365
# 4:      <NA>                                         Migrant region of origin is missing         <NA>    76
# 5:      <NA> Not considered a migrant, because region of origin is the reporting country         <NA>  2738
# 6:      <NA>                                                     Transmission is missing         <NA>   131
# 7:      <NA>                                     Date of arrival is before date of birth         <NA>     2
# 8:      <NA>                                                             Age is below 16         <NA>    61
# 9:      <NA>                                                  Date of arrival is missing         <NA>  1278

migrInput[
  !is.na(KnownPrePost),
  .(
    Count = .N,
    Percentage = .N / nrow(migrInput[!is.na(KnownPrePost)]) * 100
  ),
  keyby = list(KnownPrePost)
]
# Key: <KnownPrePost>
#    KnownPrePost Count Percentage
#          <char> <int>      <num>
# 1:         Post    30   1.152959
# 2:          Pre  1207  46.387394
# 3:      Unknown  1365  52.459646

migrOuput[!is.na(ProbPre),
  .(
    Count = .N,
    Percentage = .N / nrow(migrOuput[!is.na(ProbPre)]) * 100
  ),
  keyby = list(HIVStatus, ProbPreIs1 = ProbPre >= 1)
]
# Key: <HIVStatus, ProbPreIs1>
#    HIVStatus ProbPreIs1 Count Percentage
#       <char>     <lgcl> <int>      <num>
# 1:      <NA>         NA   752   40.64865
# 2:      <NA>      FALSE   640   34.59459
# 3:      <NA>       TRUE  1210   65.40541

meltedMigrOutput <- data.table::melt(
  migrOuput[!is.na(ProbPre)],
  measure.vars = patterns('^SCtoDiag'),
  variable.name = 'Sample',
  value.name = 'SCtoDiag'
)
meltedMigrOutput[, PreMigrInf := as.integer(SCtoDiag > Mig)]
meltedMigrOutput[, .(
  CountPreMigrInf = sum(PreMigrInf),
  Total = .N,
  Percentage = sum(PreMigrInf) / .N * 100
)]
#    CountPreMigrInf Total Percentage
#              <int> <int>      <num>
# 1:           73642 92500   79.61297

meltedMigrOutput[,
  .(
    CountPreMigrInf = sum(PreMigrInf),
    Total = .N,
    Percentage = sum(PreMigrInf) / .N * 100
  ),
  keyby = .(HIVStatus)
]
# Key: <HIVStatus>
#    HIVStatus CountPreMigrInf Total Percentage
#       <char>           <int> <int>      <num>
# 1:      <NA>           73642 92500   79.61297

appMgr$CaseMgr$MigrationResult$Artifacts$OutputStats$TableDistr$ALL$Total
# Key: <Total, StrataId>
# Index: <Algorithm>
#     Total StrataId Count MedianPriorProp MeanPriorProp Category PresentCount TotalCount PresentRatio Algorithm PriorProp PriorPropLB PriorPropUB PriorPropRange
#    <char>    <int> <num>           <num>         <num>   <char>        <int>      <int>        <num>    <char>     <num>       <num>       <num>          <num>
# 1:  Total        1  1850               1      0.796656    Total           50         50            1       GLM 0.7961855   0.7739153   0.8167814     0.04286609
#     PostProp PostPropLB PostPropUB PostPropRange
#        <num>      <num>      <num>         <num>
# 1: 0.2038145  0.1832186  0.2260847    0.04286609


## F. Test migration ===================================================================================================
appMgr <- hivPlatform::AppManager$new()
appMgr$LoadState("D:/Downloads/HIVPlatformState_20250324_203833.rds")

data <- appMgr$CaseMgr$Data
appMgr$CaseMgr$RunMigration()

nrow(appMgr$CaseMgr$MigrationResult$Input$Input)
nrow(appMgr$CaseMgr$MigrationResult$Input$Input[is.na(Excluded)])
appMgr$CaseMgr$MigrationResult$Input$Input[!is.na(Excluded), table(KnownPrePost)]
appMgr$CaseMgr$MigrationResult$Input$Input[is.na(Excluded), table(KnownPrePost)]

appMgr$CaseMgr$MigrationResult$Input$AIDS[, table(KnownPrePost)]
appMgr$CaseMgr$MigrationResult$Input$CD4VL[, table(KnownPrePost)]

data <- appMgr$CaseMgr$MigrationResult$Output

a <- hivPlatform::GetMigrantOutputStats(appMgr$CaseMgr$MigrationResult$Output)

test <- GetMigrantConfBounds(appMgr$CaseMgr$MigrationResult$Output, strat = 'Total', region = 'ALL')

data[is.na(Excluded), table(HIVStatus)]
data[, unique(HIVStatus)]

appMgr$CaseMgr$MigrationResult$Output[ProbPre == 1]

## D. Load state =======================================================================================================
appMgr <- hivPlatform::AppManager$new()
appMgr$LoadState("D:/Downloads/HIVPlatformState_20250329_101828.rds")

parameters <- list(
  Intervals = data.table::fread(
    "
    StartYear EndYear   Jump DiffByCD4 ChangeInInterval
    1980    1984  FALSE     FALSE            FALSE
    1984    2019   TRUE     FALSE             TRUE
    2019    2022  FALSE      TRUE             TRUE
    2022    2023  FALSE      TRUE             TRUE
    "
  ),
  ModelMinYear = 1980L,
  ModelMaxYear = 2023L,
  FitPosMinYear = 1987L,
  FitPosMaxYear = 2018L,
  FitPosCD4MinYear = 2019L,
  FitPosCD4MaxYear = 2023L,
  FitAIDSMinYear = 1987L,
  FitAIDSMaxYear = 1987L,
  FitAIDSPosMinYear = 1987L,
  FitAIDSPosMaxYear = 2023L,
  FullData = FALSE,
  FitDistribution = 'NEGATIVE_BINOMIAL'
)

# Combination 'All data'
popCombination <- list(Case = NULL, Aggr = appMgr$AggrMgr$PopulationNames)

appMgr$HIVModelMgr$RunMainFit(settings = list(), parameters, popCombination)
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 3L, bsType = 'NON-PARAMETRIC')

avgRunTime <- mean(sapply(appMgr$HIVModelMgr$MainFitResult, '[[', 'RunTime'))
maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')
bsCount <- bsCount
bsType <- bsType
maxRunTime <- maxRunTime
attemptsCount <- attemptsCount
mainFitResult <- appMgr$HIVModelMgr$MainFitResult
avgModelOutputs <- appMgr$HIVModelMgr$AvgModelOutputs
caseData <- appMgr$CaseMgr$Data
aggrData <- appMgr$AggrMgr$Data
popCombination <- appMgr$HIVModelMgr$PopCombination
aggrDataSelection <- appMgr$HIVModelMgr$AggrDataSelection
migrConnFlag <- appMgr$HIVModelMgr$MigrConnFlag
randomSeed <- .Random.seed


bootError <- list(
  context = bootContext,
  data = bootPopData,
  param = param,
  info = info
)
saveRDS(bootError, file = "D:/Downloads/bootError.rds")
param <- bootError$param
info <- bootError$info

param$Theta
param$ThetaF
param$ThetaP
param$NoThetaFix <- 3L
