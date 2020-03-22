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
  public = list(

    # Methods
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
        CaseBasedData = NULL,
        AttributeMapping = NULL,
        AttributeMappingStatus = NULL,
        PreProcessedCaseBasedData = NULL,
        PreProcessedCaseBasedDataStatus = NULL,
        Plots = NULL,
        AdjustedCaseBasedData = NULL
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

    ReadCaseBasedData = function(fileName) {
      private$Catalogs$CaseBasedDataPath <- fileName
      private$Catalogs$CaseBasedData <- ReadDataFile(fileName)
      private$DetermineAttributeMapping()

      cli::cli_alert_success('Read case based data {fileName}')

      return(invisible(self))
    },

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

      cli::cli_alert_success('Case based data has been pre-processed')

      return(invisible(self))
    },

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

      cli::cli_alert_success('Origin grouping has been applied')

      return(invisible(self))
    },

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

      cli::cli_ol()
      cli::cli_li('Diagnosis year density plot created')
      cli::cli_li('Notification quarter density plot created')
      cli::cli_end()

      return(invisible(self))
    },

    AdjustCaseBasedData = function(adjustmentSpecs) {
      private$Catalogs$AdjustedCaseBasedData <- RunAdjustments(
        data = private$Catalogs$PreProcessedCaseBasedData$Table,
        adjustmentSpecs = adjustmentSpecs,
        diagYearRange = NULL,
        notifQuarterRange = NULL,
        seed = NULL
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
    }
  ),

  active = list(
    Mode = function(mode) {
      if (missing(mode)) {
        return(private$Catalogs$Mode)
      } else {
        stopifnot(mode %in% c('NONE', 'ACCURACY', 'MODELLING', 'ALL-IN-ONE'))
        private$Catalogs$Mode <- mode
        return(self)
      }
    },

    CaseBasedDataPath = function(caseBasedDataPath) {
      return(private$Catalogs$CaseBasedDataPath)
    },

    CaseBasedData = function() {
      return(private$Catalogs$CaseBasedData)
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

    AdjustedCaseBasedData = function() {
      return(private$Catalogs$AdjustedCaseBasedData)
    }
  )
)
