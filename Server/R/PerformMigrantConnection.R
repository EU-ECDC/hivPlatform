PerformMigrantConnection <- function(
  caseData = copy(appMgr$CaseMgr$Data),
  aggrData = copy(appMgr$AggrMgr$Data),
  settings = list(),
  parameters = list(),
  popCombination = list(
    Case = list(
      list(Variables = c('Gender'), Values = c('M'))
    ),
    Aggr = appMgr$AggrMgr$PopulationNames
  ),
  aggrDataSelection = appMgr$HIVModelMgr$AggrDataSelection,
  migrConnFlag = TRUE
) {
  caseData <- caseData[FinalData == TRUE]
  if (!('Weight' %in% colnames(caseData))) {
    caseData[, Weight := 1]
  }
  dataAfterMigr <- 'ProbPre' %in% colnames(caseData)

  if (migrConnFlag && dataAfterMigr) {
    stopifnot(caseData[!is.na(Excluded), is.na(unique(ProbPre))])
    stopifnot(caseData[is.na(Excluded) & KnownPrePost == 'Pre', unique(ProbPre) == 1])
    stopifnot(caseData[is.na(Excluded) & KnownPrePost == 'Post', unique(ProbPre) == 0])

    caseData[, MigrClass := data.table::fcase(
      !is.na(DateOfArrival) & DateOfHIVDiagnosis < DateOfArrival, 'Diagnosed prior to arrival',
      !is.na(ProbPre) & ProbPre >= 0.5, 'Infected in the country of origin',
      !is.na(ProbPre) & ProbPre < 0.5, 'Infected in the country of destination',
      default = 'Not considered migrant'
    )]
    stopifnot(caseData[, sum(is.na(MigrClass)) == 0])
  }

  # Select population data
  res <- GetPopulationData(caseData, aggrData, popCombination, aggrDataSelection)
  caseData <- res$Case
  aggrData <- res$Aggr

  # Prepare data sets for the HIV model
  if (migrConnFlag && dataAfterMigr) {
    # Prepare the Dead file based on the whole population dataset
    caseDataDead <- PrepareDataSetsForModel(caseData, splitBy = 'Imputation', dataSets = 'Dead')

    # Prepare other datasets based on the subset of population
    caseDataRest <- PrepareDataSetsForModel(
      caseData[!(MigrClass %chin% c('Diagnosed prior to arrival', 'Infected in the country of origin'))], # nolint
      splitBy = 'Imputation',
      dataSets = c('HIV', 'AIDS', 'HIVAIDS', 'CD4')
    )
    caseDataAll <- modifyList(caseDataDead, caseDataRest)

    if ('Dead' %in% names(aggrData)) {
      aggrData <- aggrData['Dead']
    } else {
      aggrData <- NULL
    }
  } else {
    caseDataAll <- PrepareDataSetsForModel(caseData, splitBy = 'Imputation')
  }
  dataSets <- CombineData(caseDataAll, aggrData)

  # Run model
  impResult <- list()
  for (imp in names(dataSets)) {
    PrintH2('Imputation {.val {imp}}')
    context <- hivModelling::GetRunContext(
      data = dataSets[[imp]],
      settings = settings,
      parameters = list(
        INCIDENCE = parameters
      )
    )
    popData <- hivModelling::GetPopulationData(context)

    startTime <- Sys.time()
    fitResults <- hivModelling::PerformMainFit(
      context,
      popData,
      attemptSimplify = TRUE,
      verbose = TRUE
    )
    runTime <- Sys.time() - startTime

    if (migrConnFlag && dataAfterMigr) {
      model <- fitResults$MainOutputs

      # Prepare data for pre-migration infected cases
      preMigrArrY <- caseData[
        Imputation == as.integer(imp) &
          MigrClass %chin% 'Diagnosed prior to arrival' &
          !is.na(DateOfArrival),
        .(Count = sum(Weight)),
        keyby = .(Year = year(DateOfArrival))
      ]

      preMigrDiagY <- caseData[
        Imputation == as.integer(imp) &
          MigrClass %chin% 'Infected in the country of origin',
        .(Count = sum(Weight)),
        keyby = .(Year = YearOfHIVDiagnosis)
      ]

      model[preMigrArrY, DiagPriorArrival := i.Count, on = .(Year)]
      model[is.na(DiagPriorArrival), DiagPriorArrival := 0]
      model[preMigrDiagY, InfCountryOfOrigin := i.Count, on = .(Year)]
      model[is.na(InfCountryOfOrigin), InfCountryOfOrigin := 0]
      model[, NewMigrantDiagnoses := DiagPriorArrival + InfCountryOfOrigin]
      model[, ':='(
        CumInfectionsInclMigr =
          cumsum(N_Inf_M) + cumsum(NewMigrantDiagnoses) - cumsum(N_Dead_D) - Cum_Und_Dead_M,
        CumDiagnosedCasesInclMigr =
          cumsum(N_HIV_M) + cumsum(NewMigrantDiagnoses) - cumsum(N_Dead_D)
      )]
      model[, UndiagnosedFrac := 1 - CumDiagnosedCasesInclMigr / CumInfectionsInclMigr]
    }

    impResult[[imp]] <- list(
      Context = context,
      PopData = popData,
      Results = fitResults,
      RunTime = runTime,
      Imputation = imp
    )
  }

  # First set is used only!
  plotData <- GetHIVPlotData(impResult[[1]]$Results$MainOutputs)

  return(impResult)
}
