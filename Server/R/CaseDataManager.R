#' CaseDataManager
#'
#' R6 class for representing the case-based data manaager
#'
#' @name CaseDataManager
#' @examples
#' caseMgr <- CaseDataManager$new()
NULL

#' @export
CaseDataManager <- R6::R6Class(
  classname = 'CaseDataManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL
    ) {
      private$Session <- session
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        OriginalDataPath = NULL,
        OriginalData = NULL,

        AttributeMapping = NULL,
        AttributeMappingStatus = NULL,
        OriginDistribution = NULL,
        OriginGrouping = list(),

        Data = NULL,
        DataStatus = NULL
      )
    },

    print = function() {
      print(self$Session)
    },

    # USER ACTIONS =================================================================================

    # 1. Read case-based data ----------------------------------------------------------------------
    ReadData = function(fileName) {
      private$Initialize('ReadData')

      private$Catalogs$OriginalDataPath <- fileName
      private$Catalogs$OriginalData <- ReadDataFile(fileName)

      # Initialize attribute mapping
      private$DetermineAttributeMapping()

      PrintAlert('Data file {.file {fileName}} loaded')

      return(invisible(self))
    },

    # 2. Apply attribute mapping -------------------------------------------------------------------
    ApplyAttributesMapping = function(attrMapping) {
      private$Initialize('ApplyAttributesMapping')

      if (missing(attrMapping)) {
        private$DetermineAttributeMapping()
      } else {
        private$Catalogs$AttributeMapping <- attrMapping
        private$Catalogs$AttributeMappingStatus <- GetAttrMappingStatus(attrMapping)
      }

      if (private$Catalogs$AttributeMappingStatus$Valid) {
        private$Catalogs$Data <- ApplyAttributesMapping(
          private$Catalogs$OriginalData,
          private$Catalogs$AttributeMapping
        )
        PrintAlert('Attribute mapping has been applied')
        private$PreProcessData()
      } else {
        PrintAlert(
          'Attribute mapping is not valid and cannot be applied',
          type = 'danger'
        )
      }

      return(invisible(self))
    },

    # 3. Apply origin grouping ---------------------------------------------------------------------
    ApplyOriginGrouping = function(groups, type) {
      private$Initialize('ApplyOriginGrouping')

      if (missing(groups)) {
        if (missing(type)) {
          type <- 'REPCOUNTRY + UNK + OTHER'
        }
        groups <- GetOriginGroupingPreset(type, private$Catalogs$OriginDistribution)
      }
      private$Catalogs$OriginGrouping <- groups

      private$Catalogs$Data <- ApplyOriginGrouping(
        private$Catalogs$Data,
        groups
      )

      PrintAlert('Origin grouping {.val {type}} has been applied')

      return(invisible(self))
    },

    # # 4. Get summary data --------------------------------------------------------------------------
    # GetSummaryData = function() {
    #   plotDT <- private$Catalogs$PreProcessedCaseBasedData$Table

    #   # Diagnosis year plot
    #   diagYearCounts <- plotDT[, .(Count = .N), keyby = .(Gender, YearOfHIVDiagnosis)]
    #   diagYearCategories <- sort(unique(diagYearCounts$YearOfHIVDiagnosis))
    #   diagYearPlotData <- list(
    #     filter = list(
    #       scaleMinYear = min(diagYearCategories),
    #       scaleMaxYear = max(diagYearCategories),
    #       valueMinYear = min(diagYearCategories),
    #       valueMaxYear = max(diagYearCategories)
    #     ),
    #     chartCategories = diagYearCategories,
    #     chartData = list(
    #       list(
    #         name = 'Female',
    #         data = diagYearCounts[Gender == 'F', Count]
    #       ),
    #       list(
    #         name = 'Male',
    #         data = diagYearCounts[Gender == 'M', Count]
    #       )
    #     )
    #   )
    #   PrintAlert('Diagnosis year density plot data created')

    #   # Notification quarter plot
    #   notifQuarterCounts <- plotDT[,
    #     .(Count = .N),
    #     keyby = .(
    #       Gender,
    #       QuarterOfNotification = year(DateOfNotification) + quarter(DateOfNotification) / 4
    #     )
    #   ]
    #   notifQuarterCategories <- sort(unique(notifQuarterCounts$QuarterOfNotification))
    #   notifQuarterPlotData <- list(
    #     filter = list(
    #       scaleMinYear = min(notifQuarterCategories),
    #       scaleMaxYear = max(notifQuarterCategories),
    #       valueMinYear = min(notifQuarterCategories),
    #       valueMaxYear = max(notifQuarterCategories)
    #     ),
    #     chartCategories = notifQuarterCategories,
    #     chartData = list(
    #       list(
    #         name = 'Female',
    #         data = notifQuarterCounts[Gender == 'F', Count]
    #       ),
    #       list(
    #         name = 'Male',
    #         data = notifQuarterCounts[Gender == 'M', Count]
    #       )
    #     )
    #   )
    #   PrintAlert('Notification quarter density plot data created')

    #   missPlotData <- GetMissingnessPlots(plotDT)
    #   PrintAlert('Missingness plot data created')

    #   repDelPlotData <- GetReportingDelaysPlots(plotDT)
    #   PrintAlert('Reporting delays plot data created')

    #   summaryData <- list(
    #     DiagYearPlotData = diagYearPlotData,
    #     NotifQuarterPlotData = notifQuarterPlotData,
    #     MissPlotData = missPlotData,
    #     RepDelPlotData = repDelPlotData
    #   )

    #   return(summaryData)
    # },

    # # 5. Adjust case-based data --------------------------------------------------------------------
    # AdjustCaseBasedData = function(adjustmentSpecs) {
    #   private$Catalogs$AdjustmentTask <- Task$new(
    #     function(data, adjustmentSpecs) {
    #       suppressMessages(pkgload::load_all())
    #       options(width = 100)
    #       result <- hivEstimatesAccuracy2::RunAdjustments(
    #         data = data,
    #         adjustmentSpecs = adjustmentSpecs,
    #         diagYearRange = NULL,
    #         notifQuarterRange = NULL,
    #         seed = NULL
    #       )
    #       return(result)
    #     },
    #     args = list(
    #       data = isolate(private$Catalogs$PreProcessedCaseBasedData$Table),
    #       adjustmentSpecs = adjustmentSpecs
    #     ),
    #     session = private$Session
    #   )
    #   private$Catalogs$AdjustmentTask$Run()

    #   return(invisible(self))
    # },

    # CancelAdjustmentTask = function() {
    #   private$Catalogs$AdjustmentTask$Stop()

    #   return(invisible(self))
    # },

    # SetMICount = function(count) {
    #   private$Catalogs$MICount <- max(count, 0)
    # }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Storage
    Catalogs = NULL,

    Initialize = function(step) {
      if (step == 'ReadData') {
        private$Catalogs$OriginalDataPath <- NULL
        private$Catalogs$OriginalData <- NULL
        private$Catalogs$AttributeMapping <- NULL
        private$Catalogs$AttributeMappingStatus <- NULL
        private$Catalogs$OriginDistribution <- NULL
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$Data <- NULL
        private$Catalogs$DataStatus <- NULL
      } else if (step == 'ApplyAttributeMapping') {
        private$Catalogs$AttributeMapping <- NULL
        private$Catalogs$AttributeMappingStatus <- NULL
        private$Catalogs$OriginDistribution <- NULL
        private$Catalogs$OriginGrouping <- list()
        private$Catalogs$Data <- NULL
        private$Catalogs$DataStatus <- NULL
      } else if (step == 'ApplyOriginGrouping') {
        private$Catalogs$OriginGrouping <- list()
        if ('GroupedRegionOfOrigin' %in% colnames(private$Catalogs$Data$Table)) {
          private$Catalogs$Data$Table[, GroupedRegionOfOrigin := NULL]
        }
      }
    },

    DetermineAttributeMapping = function() {
      attrMapping <- GetPreliminaryAttributesMapping(private$Catalogs$OriginalData)
      private$Catalogs$AttributeMapping <- attrMapping
      private$Catalogs$AttributeMappingStatus <- GetAttrMappingStatus(attrMapping)
    },

    PreProcessData = function() {
      dt <- PreProcessInputDataBeforeSummary(private$Catalogs$Data)
      PreProcessInputDataBeforeAdjustments(dt$Table)
      dtStatus <- GetInputDataValidityStatus(dt$Table)

      private$Catalogs$DataStatus <- dtStatus
      if (dtStatus$Valid) {
        private$Catalogs$Data <- dt
        private$Catalogs$OriginDistribution <- GetOriginDistribution(dt$Table)
        PrintAlert('Data has been pre-processed')
      } else {
        PrintAlert('Data contains invalid values. Pre-processing is reverted.', type = 'danger')
      }

      return(invisible(self))
    }

  ),

  active = list(
    OriginalDataPath = function() {
      return(private$Catalogs$OriginalDataPath)
    },

    OriginalData = function() {
      return(private$Catalogs$OriginalData)
    },

    AttributeMapping = function() {
      return(private$Catalogs$AttributeMapping)
    },

    AttributeMappingStatus = function() {
      return(private$Catalogs$AttributeMappingStatus)
    },

    OriginDistribution = function() {
      return(private$Catalogs$OriginDistribution)
    },

    OriginGrouping = function() {
      return(private$Catalogs$OriginGrouping)
    },

    Data = function() {
      return(private$Catalogs$Data)
    },

    DataStatus = function() {
      return(private$Catalogs$DataStatus)
    }

    # MICount = function() {
    #   return(private$Catalogs$MICount)
    # },

    # AdjustmentRunLog = function() {
    #   return(private$Catalogs$AdjustmentRunLog)
    # },

    # FinalAdjustedCaseBasedData = function() {
    #   dt <- private$Catalogs$AdjustedCaseBasedData
    #   if (!is.null(dt)) {
    #     finalIdx <- length(private$Catalogs$AdjustedCaseBasedData)
    #     result <- private$Catalogs$AdjustedCaseBasedData[[finalIdx]]
    #   } else {
    #     result <- NULL
    #   }

    #   return(result)
    # },

    # PopulationCombination = function() {
    #   return(private$Catalogs$PopulationCombination)
    # },

    # AdjustmentTask = function() {
    #   return(private$Catalogs$AdjustmentTask)
    # }
  )
)
