PerformMigrantConnection <- function(
  data = copy(appMgr$CaseMgr$Data)
) {
  # 1. Data after migration modelling - Checks -----------------------------------------------------
  stopifnot(data[FinalData == FALSE, is.na(unique(Excluded))])
  stopifnot(data[!is.na(Excluded), is.na(unique(ProbPre))])
  stopifnot(data[is.na(Excluded) & KnownPrePost == 'Pre', unique(ProbPre) == 1])
  stopifnot(data[is.na(Excluded) & KnownPrePost == 'Post', unique(ProbPre) == 0])

  # 2. Classify each case in the case based data ---------------------------------------------------
  data[FinalData == TRUE, MigrClass := fcase(
    !is.na(DateOfArrival) & DateOfHIVDiagnosis < DateOfArrival, 'Diagnosed prior to arrival',
    !is.na(ProbPre) & ProbPre >= 0.5, 'Infected in the country of origin',
    !is.na(ProbPre) & ProbPre < 0.5, 'Infected in the country of destination',
    default = 'Not considered migrant'
  )]
  stopifnot(data[FinalData == TRUE, sum(is.na(MigrClass)) == 0])

  # 3.	Modelling flow (for population = All): -----------------------------------------------------

  # a. Prepare the Dead file based on the whole dataset
  if (!('Weight' %in% colnames(data))) {
    data[, Weight := 1.0]
  }
  dead <- lapply(
    split(data[FinalData == TRUE & !is.na(DateOfDeath)], by = 'Imputation'),
    function(dt) {
      dt[, .(Count = sum(Weight)), keyby = .(Year = year(DateOfDeath))]
    }
  )

  # b. Exclude cases classified as b. or c. (in 2.)
  # c. Prepare input datasets (HIV, HIVAIDS, HIV_CD4_XX, AIDS) as usual based on the subset data
  hivData <- PrepareDataSetsForModel(
    data[
      FinalData == TRUE &
        !(MigrClass %chin% c('Diagnosed prior to arrival', 'Infected in the country of origin'))
    ],
    splitBy = 'Imputation'
  )
  for (imp in names(hivData)) {
    hivData[[imp]][['Dead']] <- dead[[imp]]
  }

  # d. Run model
  # DEBUG: First set used only for testing purposes
  context <- hivModelling::GetRunContext(
    data = hivData[[1]],
    settings = list(),
    parameters = list()
  )
  popData <- hivModelling::GetPopulationData(context)
  fitResults <- hivModelling::PerformMainFit(
    context,
    popData,
    attemptSimplify = TRUE,
    verbose = TRUE
  )

  # e. Estimate New_infections, Cumulative_new_infections, New_diagnoses
  model <- fitResults$MainOutputs[, .(
    Year,
    Infections = N_Inf_M,
    Diagnoses = N_HIV_M,
    DeadsAIDS = N_Dead_D,
    DeadsUndiagnosed = diff(c(0, Cum_Und_Dead_M))
  )]

  # 4. Prepare data for pre-migration infected cases -----------------------------------------------

  # a. Take cases classified as b. or c. (in 2.)
  preMigrData <- data[
    FinalData == TRUE &
      !is.na(DateOfArrival) &
      MigrClass %chin% c('Diagnosed prior to arrival', 'Infected in the country of origin')
  ]
  preMigrData[MigrClass == 'Diagnosed prior to arrival', MigrClass := 'Before']
  preMigrData[MigrClass == 'Infected in the country of origin', MigrClass := 'After']

  # b. Summarize by Year of Arrival (let’s call them New_migrant_cases),
  #    create yearly Cumulative_New_migrant_cases)
  preMigrArrY <- preMigrData[,
    .(N = sum(Weight)),
    keyby = .(MigrClass, Year = year(DateOfArrival))
  ]
  preMigrArrY <- dcast(preMigrArrY, 'Year ~ MigrClass', value.var = c('N'), fill = 0)
  setcolorder(preMigrArrY, c('Year', 'Before', 'After'))

  # c. Summarize cases diagnosed prior to arrival (b.) by year of arrival and cases diagnosed after
  # arrival (c.) by Year of diagnosis  , add these two columns (call the sum New_migrant_diagnoses),
  # create yearly cumulative count Cumulative_newe_migrant_diagnoses
  preMigrDiagY <- preMigrData[,
    .(N = sum(Weight)),
    keyby = .(MigrClass, Year = year(DateOfHIVDiagnosis))
  ]
  preMigrDiagY <- dcast(preMigrDiagY, 'Year ~ MigrClass', value.var = c('N'), fill = 0)
  setcolorder(preMigrDiagY, c('Year', 'Before', 'After'))

  migr <- merge(model, preMigrArrY, by = c('Year'), all = TRUE)
  migr <- merge(migr, preMigrDiagY, by = c('Year'), suffixes = c('ArrY', 'DiagY'), all = TRUE)
  setnafill(migr, type = 'const', fill = 0)
  migr[, NewMigrantDiagnoses := BeforeArrY + AfterDiagY]

  # 5. Final post-processing -----------------------------------------------------------------------

  # a. Prevalent cases (people living with HIV) = Cumulative Incident Cases (from the incidence
  # model) + Cumulative_New_migrant_cases (possibly adjusted for delay between arrival and
  # diagnosis) – mortality from the model –   Deaths from Dead file
  migr[, CumInfectionsInclMigr := cumsum(Infections) + cumsum(BeforeArrY + AfterArrY) - cumsum(DeadsAIDS) - cumsum(DeadsUndiagnosed)] # nolint

  # b. Diagnosed cases = Cumulative Diagnoses (from the model) + Cumulative_new_migrant_diagnoses –
  # Deaths from the Dead file
  migr[, CumDiagnosesCasesInclMigr := cumsum(Diagnoses) + cumsum(NewMigrantDiagnoses) - cumsum(DeadsAIDS)] # nolint

  # c. Undiagnosed fraction = 1-Diagnosed cases / Prevalent cases
  migr[, UndiagnosedFrac := 1 - CumDiagnosedCasesInclMigr / CumInfectionsInclMigr]

  return(migr)
}
