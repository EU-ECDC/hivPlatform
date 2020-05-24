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

      private$Session <- session

      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Mode = mode,
        CaseBasedDataPath = NULL,
        AttributeMapping = NULL,
        AttributeMappingStatus = NULL,
        PreProcessedCaseBasedDataStatus = NULL,
        Plots = NULL,
        MICount = 0,
        BSCount = 0,

        CaseBasedData = NULL,
        PreProcessedCaseBasedData = NULL,
        AdjustedCaseBasedData = NULL,
        AggregatedData = NULL,

        HIVModelResults = NULL
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
      private$DetermineAttributeMapping()

      PrintAlert('Case-based data file {.file {fileName}} loaded')

      return(invisible(self))
    },

    # 2. Pre-process case-based data ---------------------------------------------------------------
    PreProcessCaseBasedData = function() {
      dt <- ApplyAttributesMapping(
        private$Catalogs$CaseBasedData,
        private$Catalogs$AttributeMapping,
        GetPreliminaryDefaultValues()
      )

      dt <- PreProcessInputDataBeforeSummary(dt)
      dtStatus <- GetInputDataValidityStatus(dt$Table)

      private$Catalogs$PreProcessedCaseBasedData <- dt
      private$Catalogs$PreProcessedCaseBasedDataStatus <- dtStatus

      PrintAlert('Case-based data has been pre-processed')

      return(invisible(self))
    },

    # 3. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(type) {
      map <- GetOriginGroupingMap(
        type,
        GetOriginDistribution(private$Catalogs$PreProcessedCaseBasedData$Table)
      )

      map[
        FullRegionOfOrigin %in% c('CENTEUR', 'EASTEUR', 'EUROPE', 'WESTEUR'),
        GroupedRegionOfOrigin := 'EUROPE'
      ]
      map[
        FullRegionOfOrigin %in% c('SUBAFR'),
        GroupedRegionOfOrigin := 'SUBAFR'
      ]
      map[
        GroupedRegionOfOrigin %in% c('OTHER'),
        GroupedRegionOfOrigin := FullRegionOfOrigin
      ]

      private$Catalogs$PreProcessedCaseBasedData <- ApplyOriginGroupingMap(
        private$Catalogs$PreProcessedCaseBasedData,
        map
      )

      PrintAlert('Origin grouping has been applied')

      return(invisible(self))
    },

    # 4. Create plots ------------------------------------------------------------------------------
    CreatePlots = function() {
      diagnosisYearDensity <- GetDiagnosisYearDensityPlot(
        private$Catalogs$PreProcessedCaseBasedData$Table
      )
      notificationQuarterDensity <- GetNotificationQuarterDensityPlot(
        private$Catalogs$PreProcessedCaseBasedData$Table
      )

      private$Catalogs$Plots <- list(
        DiagnosisYearDensity = diagnosisYearDensity,
        NotificationQuarterDensity = notificationQuarterDensity
      )

      PrintAlert('Diagnosis year density plot created')
      PrintAlert('Notification quarter density plot created')

      return(invisible(self))
    },

    # 5. Adjust case-based data --------------------------------------------------------------------
    AdjustCaseBasedData = function(adjustmentSpecs, miCount = NULL) {

      if (is.null(miCount)) {
        miCount <- private$Catalogs$MICount
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
    FitHIVModelToAdjustedData = function() {
      aggregatedDataSets <- private$Catalogs$AggregatedData

      results <- list()
      for (i in seq_along(aggregatedDataSets)) {
        context <- hivModelling::GetRunContext(data = aggregatedDataSets[[i]], parameters = list())
        data <- hivModelling::GetPopulationData(context)
        results <- hivModelling::PerformMainFit(context, data)

        results[[i]] <-  list(
          Context = context,
          Data = data,
          Results = results
        )
      }

      private$Catalogs$HIVModelResults <- results
    },

    # 7. Perform non-parametric bootstrap ----------------------------------------------------------
    Fit = function() {

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

      if (is.null(attrMapping[['RecordId']])) {
        attrMapping[['RecordId']] <- 'Identyfikator'
      }
      if (is.null(attrMapping[['Age']])) {
        attrMapping[['Age']] <- 'WiekHIVdor'
      }

      # Map 'FirstCD4Count' to 'cd4_num' if not mapped yet
      if (is.null(attrMapping[['FirstCD4Count']])) {
        attrMapping[['FirstCD4Count']] <- 'cd4_num'
      }

      attrMapping[['FirstCD4Count']] <- 'cd4_num'

      private$Catalogs$AttributeMapping <- attrMapping
      private$Catalogs$AttributeMappingStatus <- GetAttrMappingStatus(attrMapping)
    },

    PrepareAggregatedData = function() {
      miData <- self$FinalAdjustedCaseBasedData$Table[Imputation != 0]
      private$Catalogs$AggregatedData <- PrepareDataSetsForModel(miData, splitBy = 'Imputation')

      return(invisible(self))
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

    CaseBasedDataPath = function(caseBasedDataPath) {
      return(private$Catalogs$CaseBasedDataPath)
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

    Plots = function() {
      return(private$Catalogs$Plots)
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

    HIVModelResults = function() {
      return(private$Catalogs$HIVModelResults)
    }

  )
)
