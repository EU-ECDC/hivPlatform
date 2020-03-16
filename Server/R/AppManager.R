#' AppManager
#'
#' R6 class for representing the app manaager
#'
#' @name AppManager
#' @examples
#' pppManager <- AppManager$new()
#'
NULL

#' @export
AppManager <- R6::R6Class(
  classname = 'AppManager',
  public = list(

    # Is it reactive type? Required for shiny app
    Reactive = FALSE,

    # Methods
    initialize = function(
      reactive = FALSE,
      mode = 'NONE'
    ) {
      stopifnot(mode %in% c('NONE', 'ACCURACY', 'MODELLING', 'ALL-IN-ONE'))

      self$Reactive <- reactive

      catalogStorage <- ifelse(reactive, shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Mode = mode,
        CaseBasedDataPath = NULL,
        CaseBasedData = NULL,
        AttributeMapping = NULL,
        AttributeMappingStatus = NULL,
        PreProcessedCaseBasedData = NULL,
        PreProcessedCaseBasedDataStatus = NULL
      )
    },

    print = function() {
      print(self$Reactive)
    },

    ReadCaseBasedData = function(fileName) {
      private$Catalogs$CaseBasedDataPath <- fileName
      private$Catalogs$CaseBasedData <- ReadDataFile(fileName)
      private$DetermineAttributeMapping()
      return(self)
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
      return(self)
    },

    ApplyOriginGrouping = function(type) {
      map <- GetOriginGroupingMap(
        type,
        GetOriginDistribution(private$Catalogs$PreProcessedCaseBasedData$Table)
      )

      map[FullRegionOfOrigin %in% c("CENTEUR", "EASTEUR", "EUROPE", "WESTEUR"),
          GroupedRegionOfOrigin := "EUROPE"]
      map[FullRegionOfOrigin %in% c("SUBAFR"),
          GroupedRegionOfOrigin := "SUBAFR"]
      map[GroupedRegionOfOrigin %in% c("OTHER"),
          GroupedRegionOfOrigin := FullRegionOfOrigin]

      private$Catalogs$PreProcessedCaseBasedData <- ApplyOriginGroupingMap(
        private$Catalogs$PreProcessedCaseBasedData,
        map
      )
      return(self)
    }
  ),

  private = list(
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
    }


  )
)
