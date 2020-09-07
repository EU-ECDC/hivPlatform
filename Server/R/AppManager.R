#' AppManager
#'
#' R6 class for representing the app manaager
#'
#' @name AppManager
#' @examples
#' pppManager <- AppManager$new()
NULL

#' @export
AppManager <- R6::R6Class(
  classname = 'AppManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL,
      mode = 'NONE'
    ) {
      stopifnot(mode %in% c('NONE', 'ACCURACY', 'MODELLING', 'ALL-IN-ONE'))

      print(tempdir())

      private$Session <- session

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Mode = mode,

        CaseBasedDataPath = NULL,
        AggregatedDataPath = NULL,

        AttributeMapping = NULL,
        AttributeMappingStatus = NULL,
        OriginDistribution = NULL,
        OriginGrouping = list(),
        PreProcessedCaseBasedDataStatus = NULL,

        MICount = 0,
        BSCount = 0,

        CaseBasedData = NULL,
        PreProcessedCaseBasedData = NULL,
        AdjustedCaseBasedData = NULL,
        AggregatedData = NULL,

        HIVModelResults = NULL,
        HIVBootstrapModelResults = NULL
      )
    },

    print = function() {
      print(self$Session)
    },

    SendEventToReact = function(eventName, value) {
      if (!is.null(private$Session)) {
        private$Session$sendCustomMessage(eventName, value)
      }
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadCaseBasedData = function(fileName) {
      private$Catalogs$CaseBasedDataPath <- fileName
      private$Catalogs$CaseBasedData <- ReadDataFile(fileName)

      # Initialize attribute mapping
      private$DetermineAttributeMapping()

      PrintAlert('Case-based data file {.file {fileName}} loaded')

      return(invisible(self))
    },

    ReadAggregatedData = function(fileName) {
      private$Catalogs$AggregatedDataPath <- fileName
      private$Catalogs$AggregatedData <- hivModelling::ReadInputData(fileName)

      PrintAlert('Aggregated data file {.file {fileName}} loaded')

      return(invisible(self))
    },

    # 2. Apply attribute mapping -------------------------------------------------------------------
    ApplyAttributesMappingToCaseBasedData = function(attrMapping) {
      if (missing(attrMapping)) {
        private$DetermineAttributeMapping()
      } else {
        private$Catalogs$AttributeMapping <- attrMapping
        private$Catalogs$AttributeMappingStatus <- GetAttrMappingStatus(attrMapping)
      }

      private$Catalogs$PreProcessedCaseBasedData <- ApplyAttributesMapping(
        private$Catalogs$CaseBasedData,
        private$Catalogs$AttributeMapping
      )

      PrintAlert('Attribute mapping has been applied to case-based data')

      return(invisible(self))
    },

    # 3. Pre-process case-based data ---------------------------------------------------------------
    PreProcessCaseBasedData = function() {
      dt <- PreProcessInputDataBeforeSummary(private$Catalogs$PreProcessedCaseBasedData)
      PreProcessInputDataBeforeAdjustments(dt$Table)
      dtStatus <- GetInputDataValidityStatus(dt$Table)

      private$Catalogs$PreProcessedCaseBasedData <- dt
      private$Catalogs$PreProcessedCaseBasedDataStatus <- dtStatus
      private$Catalogs$OriginDistribution <- GetOriginDistribution(dt$Table)

      PrintAlert('Case-based data has been pre-processed')

      return(invisible(self))
    },

    # 4. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(groups, type) {
      if (missing(groups)) {
        groups <- GetOriginGroupingPreset(type, private$Catalogs$OriginDistribution)
      }
      private$Catalogs$OriginGrouping <- groups

      private$Catalogs$PreProcessedCaseBasedData <- ApplyOriginGroupingMap(
        private$Catalogs$PreProcessedCaseBasedData,
        groups
      )

      self$SendEventToReact('shinyHandler', list(
        Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED',
        Status = 'SUCCESS',
        Payload = list()
      ))

      PrintAlert('Origin grouping has been applied')

      return(invisible(self))
    },

    # 4. Create plots ------------------------------------------------------------------------------
    GetSummaryData = function() {
      plotDT <- private$Catalogs$PreProcessedCaseBasedData$Table

      # Diagnosis year plot
      diagYearCounts <- plotDT[, .(Count = .N), keyby = .(Gender, YearOfHIVDiagnosis)]
      diagYearCategories <- sort(unique(diagYearCounts$YearOfHIVDiagnosis))
      diagYearPlotData <- list(
        filter = list(
          scaleMinYear = min(diagYearCategories),
          scaleMaxYear = max(diagYearCategories),
          valueMinYear = min(diagYearCategories),
          valueMaxYear = max(diagYearCategories)
        ),
        chartCategories = diagYearCategories,
        chartData = list(
          list(
            name = 'Female',
            data = diagYearCounts[Gender == 'F', Count]
          ),
          list(
            name = 'Male',
            data = diagYearCounts[Gender == 'M', Count]
          )
        )
      )
      PrintAlert('Diagnosis year density plot data created')

      # Notification quarter plot
      notifQuarterCounts <- plotDT[,
        .(Count = .N),
        keyby = .(
          Gender,
          QuarterOfNotification = year(DateOfNotification) + quarter(DateOfNotification) / 4
        )
      ]
      notifQuarterCategories <- sort(unique(notifQuarterCounts$QuarterOfNotification))
      notifQuarterPlotData <- list(
        filter = list(
          scaleMinYear = min(notifQuarterCategories),
          scaleMaxYear = max(notifQuarterCategories),
          valueMinYear = min(notifQuarterCategories),
          valueMaxYear = max(notifQuarterCategories)
        ),
        chartCategories = notifQuarterCategories,
        chartData = list(
          list(
            name = 'Female',
            data = notifQuarterCounts[Gender == 'F', Count]
          ),
          list(
            name = 'Male',
            data = notifQuarterCounts[Gender == 'M', Count]
          )
        )
      )
      PrintAlert('Notification quarter density plot data created')

      missPlotData <- GetMissingnessPlots(plotDT)
      PrintAlert('Missingness plot data created')

      repDelPlotData <- GetReportingDelaysPlots(plotDT)
      PrintAlert('Reporting delays plot data created')

      summaryData <- list(
        DiagYearPlotData = diagYearPlotData,
        NotifQuarterPlotData = notifQuarterPlotData,
        MissPlotData = missPlotData,
        RepDelPlotData = repDelPlotData
      )

      return(summaryData)
    },

    # 5. Adjust case-based data --------------------------------------------------------------------
    AdjustCaseBasedData = function(
      miCount = NULL,
      adjustmentSpecs
    ) {
      if (is.null(miCount)) {
        miCount <- private$Catalogs$MICount
      } else {
        private$Catalogs$MICount <- miCount
      }

      adjustNames <- names(adjustmentSpecs)
      miTypes <- sapply(adjustmentSpecs, '[[', 'Type') == 'MULTIPLE_IMPUTATIONS'
      adjustmentSpecs <- setNames(lapply(
        seq_along(miTypes),
        function(i) {
          miType <- miTypes[i]
          as <- adjustmentSpecs[[i]]
          if (miType) {
            as$Parameters$nimp$value <- miCount
          }

          return(as)
        }
      ), adjustNames)

      private$Catalogs$AdjustedCaseBasedData <- RunAdjustments(
        data = private$Catalogs$PreProcessedCaseBasedData$Table,
        adjustmentSpecs = adjustmentSpecs,
        diagYearRange = NULL,
        notifQuarterRange = NULL,
        seed = NULL
      )

      private$PrepareAggregatedData()

      return(invisible(self))
    },

    # 6. Fit HIV model to adjusted data ------------------------------------------------------------
    FitHIVModelToAdjustedData = function(
      settings = list(),
      parameters = list()
    ) {
      aggregatedDataSets <- private$Catalogs$AggregatedData

      results <- list()
      for (i in seq_along(aggregatedDataSets)) {
        context <- hivModelling::GetRunContext(
          data = aggregatedDataSets[[i]],
          settings = settings,
          parameters = parameters
        )
        data <- hivModelling::GetPopulationData(context)

        startTime <- Sys.time()
        fitResults <- hivModelling::PerformMainFit(context, data, attemptSimplify = FALSE)
        runTime <- Sys.time() - startTime

        results[[i]] <- list(
          Context = context,
          Data = data,
          Results = fitResults,
          RunTime = runTime
        )

        PrintAlert(
          'Fit to data set {.val {i}} done |',
          'Run time: {.timestamp {prettyunits::pretty_dt(runTime)}}',
          type = 'success'
        )
      }

      private$Catalogs$HIVModelResults <- results

      return(invisible(self))
    },

    # 7. Perform non-parametric bootstrap ----------------------------------------------------------
    FitHIVModelToBootstrapData = function(
      bsCount = NULL,
      verbose = FALSE,
      maxRunTimeFactor = 3
    ) {
      if (is.null(bsCount)) {
        bsCount <- private$Catalogs$BSCount
      } else {
        private$Catalogs$BSCount <- bsCount
      }

      avgRunTime <- mean(sapply(private$Catalogs$HIVModelResults, '[[', 'RunTime'))
      maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')

      PrintAlert('Maximum allowed run time: {.timestamp {prettyunits::pretty_dt(maxRunTime)}}')

      miCount <- length(private$Catalogs$HIVModelResults)
      results <- list()
      for (i in seq_len(miCount)) {

        PrintH2('Adjusted data {.val {i}}')

        hivModelResults <- private$Catalogs$HIVModelResults[[i]]

        context <- hivModelResults$Context
        param <- hivModelResults$Results$Param
        info <- hivModelResults$Results$Info

        context$Settings <- modifyList(
          context$Settings,
          list(
            ModelFilePath = NULL,
            InputDataPath = NULL,
            Verbose = verbose
          ),
          keep.null = TRUE
        )

        mainCaseBasedDataSet <- self$FinalAdjustedCaseBasedData$Table[Imputation == i]

        bootResults <- list()
        jSucc <- 1
        j <- 0
        while (jSucc <= bsCount) {
          j <- j + 1

          # Bootstrap data set
          indices <- sample.int(nrow(mainCaseBasedDataSet), replace = TRUE)
          bootCaseBasedDataSet <- mainCaseBasedDataSet[indices]
          bootAggregatedData <- PrepareDataSetsForModel(bootCaseBasedDataSet)

          bootContext <- hivModelling::GetRunContext(
            parameters = context$Parameters,
            settings = context$Settings,
            data = bootAggregatedData
          )

          bootData <- hivModelling::GetPopulationData(bootContext)

          startTime <- Sys.time()
          bootResult <- hivModelling::PerformMainFit(
            bootContext, bootData, param = param, info = info, attemptSimplify = FALSE,
            maxRunTime = maxRunTime
          )
          runTime <- Sys.time() - startTime

          msgType <- ifelse(bootResult$Converged, 'success', 'danger')

          PrintAlert(
            'Fit to data set {.val {jSucc}} done |',
            'Run time: {.timestamp {prettyunits::pretty_dt(runTime)}}',
            type = msgType
          )

          bootResults[[j]] <- list(
            Context = bootContext,
            Data = bootData,
            Results = bootResult,
            RunTime = runTime
          )

          if (bootResult$Converged) {
            jSucc <- jSucc + 1
          }

          progress <- (jSucc + (i - 1) * bsCount)/(miCount * bsCount) * 100
          self$SendEventToReact('shinyHandler', list(
            Type = 'BOOTSTRAP_RUN_PROGRESSES',
            Status = 'SUCCESS',
            Payload = list(
              Progress = progress
            )
          ))
        }

        results[[i]] <- bootResults
      }

      private$Catalogs$HIVBootstrapModelResults <- results

      return(invisible(self))
    },

    ComputeHIVBootstrapStatistics = function() {
      flatList <- self$FlatHIVBootstrapModelResults

      resultsList <- lapply(flatList, '[[', 'Results')

      runTime <- sapply(resultsList, '[[', 'RunTime')

      converged <- sapply(resultsList, '[[', 'Converged')

      succFlatList <- Filter(function(item) item$Results$Converged, flatList)

      succResultsList <- lapply(succFlatList, '[[', 'Results')

      info <- lapply(succResultsList, '[[', 'Info')[[1]]
      years <- info$ModelMinYear:(info$ModelMaxYear - 1)

      mainOutputList <- lapply(succResultsList, '[[', 'MainOutputs')
      colNames <- colnames(mainOutputList[[1]])
      mainOutputStats <- setNames(lapply(colNames, function(colName) {
        resultSample <- sapply(mainOutputList, '[[', colName)
        result <- cbind(
          t(apply(resultSample, 1, quantile, c(0.025, 0.5, 0.975))),
          Mean = apply(resultSample, 1, mean),
          Std = apply(resultSample, 1, sd)
        )
        rownames(result) <- years
        return(result)
      }), colNames)

      succParamList <- lapply(succResultsList, '[[', 'Param')
      betas <- as.data.table(t(sapply(succParamList, '[[', 'Beta')))
      setnames(betas, sprintf('Beta%d', seq_len(ncol(betas))))
      bootBetasStats <- lapply(betas, function(col) {
        c(
          quantile(col, probs = c(0.025, 0.5, 0.975)),
          Mean = mean(col),
          Std = sd(col)
        )
      })

      thetas <- as.data.table(t(sapply(succParamList, '[[', 'Theta')))
      setnames(thetas, sprintf('Theta%d', seq_len(ncol(thetas))))
      bootThetasStats <- lapply(thetas, function(col) {
        c(
          quantile(col, probs = c(0.025, 0.5, 0.975)),
          Mean = mean(col),
          Std = sd(col)
        )
      })

      private$Catalogs$HIVBootstrapStatistics <- list(
        RunTime = runTime,
        Converged = converged,
        Beta = betas,
        Theta = thetas,
        MainOutputsStats = mainOutputStats,
        BetaStats = bootBetasStats,
        ThetaStats = bootThetasStats
      )

      return(invisible(self))
    },

    CreateReport = function(reportName) {
      reportFilePath <- GetReportFileNames()[reportName]
      params <- list(
        AdjustedData = private$Catalogs$AdjustedCaseBasedData,
        ReportingDelay = TRUE,
        Smoothing = TRUE,
        CD4ConfInt = FALSE
      )

      if (is.element(reportName, c('Main Report'))) {
        params <- GetMainReportArtifacts(params)
      }

      params <- modifyList(
        params,
        list(
          Artifacts = list(
            FileName = private$Catalogs$CaseBasedDataPath,
            DiagYearRange = NULL,
            NotifQuarterRange = NULL,
            DiagYearRangeApply = TRUE
          )
        )
      )

      htmlReportFileName <- RenderReportToFile(
        reportFilePath = reportFilePath,
        format = 'html_document',
        params = params,
        outDir = dirname(private$Catalogs$CaseBasedDataPath)
      )

      return(htmlReportFileName)
    },

    SetMICount = function(count) {
      private$Catalogs$MICount <- max(count, 0)
    },

    SetBSCount = function(count) {
      private$Catalogs$BSCount <- max(count, 0)
    }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Storage
    Catalogs = NULL,

    DetermineAttributeMapping = function() {
      attrMapping <- GetPreliminaryAttributesMapping(private$Catalogs$CaseBasedData)
      private$Catalogs$AttributeMapping <- attrMapping
      private$Catalogs$AttributeMappingStatus <- GetAttrMappingStatus(attrMapping)
    },

    PrepareAggregatedData = function(strata = NULL) {
      miData <- self$FinalAdjustedCaseBasedData$Table[Imputation != 0]
      private$Catalogs$AggregatedData <- PrepareDataSetsForModel(
        miData,
        splitBy = 'Imputation',
        strata = strata
      )

      return(invisible(self))
    },

    PrepareBootstrapAggregatedData = function(strata = NULL) {
      bootCaseBasedDataSets <- private$Catalogs$BootstrapCaseBasedDataSets
      bootAggregatedDataSets <- lapply(
        bootCaseBasedDataSets,
        function(bootCaseBasedDataSet) {
          lapply(bootCaseBasedDataSet, PrepareDataSetsForModel, strata = strata)
        }
      )

      private$Catalogs$BootstrapAggregatedDataSets <- bootAggregatedDataSets
    }
  ),

  active = list(
    Mode = function(mode) {
      if (missing(mode)) {
        return(private$Catalogs$Mode)
      } else {
        if (!mode %in% c('NONE', 'ACCURACY', 'MODELLING', 'ALL-IN-ONE')) {
          mode <- 'NONE'
        }
        private$Catalogs$Mode <- mode
        return(self)
      }
    },

    CaseBasedDataPath = function() {
      return(private$Catalogs$CaseBasedDataPath)
    },

    AggregatedDataPath = function() {
      return(private$Catalogs$AggregatedDataPath)
    },

    AttributeMapping = function() {
      return(private$Catalogs$AttributeMapping)
    },

    AttributeMappingStatus = function() {
      return(private$Catalogs$AttributeMappingStatus)
    },

    PreProcessedCaseBasedData = function() {
      return(private$Catalogs$PreProcessedCaseBasedData)
    },

    PreProcessedCaseBasedDataStatus = function() {
      return(private$Catalogs$PreProcessedCaseBasedDataStatus)
    },

    OriginDistribution = function() {
      return(private$Catalogs$OriginDistribution)
    },

    OriginGrouping = function() {
      return(private$Catalogs$OriginGrouping)
    },

    MICount = function() {
      return(private$Catalogs$MICount)
    },

    BSCount = function() {
      return(private$Catalogs$BSCount)
    },

    CaseBasedData = function() {
      return(private$Catalogs$CaseBasedData)
    },

    AdjustedCaseBasedData = function() {
      return(private$Catalogs$AdjustedCaseBasedData)
    },

    FinalAdjustedCaseBasedData = function() {
      finalIdx <- length(private$Catalogs$AdjustedCaseBasedData)
      return(private$Catalogs$AdjustedCaseBasedData[[finalIdx]])
    },

    AggregatedData = function() {
      return(private$Catalogs$AggregatedData)
    },

    BootstrapCaseBasedDataSets = function() {
      return(private$Catalogs$BootstrapCaseBasedDataSets)
    },

    BootstrapAggregatedDataSets = function() {
      return(private$Catalogs$BootstrapAggregatedDataSets)
    },

    HIVModelResults = function() {
      return(private$Catalogs$HIVModelResults)
    },

    HIVBootstrapModelResults = function() {
      return(private$Catalogs$HIVBootstrapModelResults)
    },

    FlatHIVBootstrapModelResults = function() {
      return(Reduce(c, private$Catalogs$HIVBootstrapModelResults))
    },

    HIVBootstrapStatistics = function() {
      return(private$Catalogs$HIVBootstrapStatistics)
    }
  )
)
