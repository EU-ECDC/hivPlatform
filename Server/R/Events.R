Events <- function(
  input,
  output,
  session,
  appMgr
) {
  # Case-based data upload event
  observeEvent(input$caseUploadBtn, {
    fileInfo <- input$caseUploadBtn
    print(fileInfo)

    # Case based data uploaded
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_UPLOADED',
      Status = 'SUCCESS',
      Payload = list(
        FileName = fileInfo$name[1],
        FileSize = fileInfo$size[1],
        FileType = fileInfo$type[1],
        FilePath = fileInfo$datapath[1]
      )
    ))

    appMgr$ReadCaseBasedData(fileInfo$datapath)

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_READ',
      Status = 'SUCCESS',
      Payload = list(
        ColumnNames = colnames(appMgr$CaseBasedData),
        RecordCount = nrow(appMgr$CaseBasedData),
        AttributeMapping = unname(appMgr$AttributeMapping)
      )
    ))
  })

  observeEvent(input$aggrUploadBtn, {
    fileInfo <- input$aggrUploadBtn
    print(fileInfo)

    # Case based data uploaded
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'AGGR_DATA_UPLOADED',
      Status = 'SUCCESS',
      Payload = list(
        FileName = fileInfo$name[1],
        FileSize = fileInfo$size[1],
        FileType = fileInfo$type[1],
        FilePath = fileInfo$datapath[1]
      )
    ))

    appMgr$ReadAggregatedData(fileInfo$datapath)
    dataNames <- names(appMgr$AggregatedData)
    dataFiles <- lapply(
      dataNames,
      function(dataName) {
        dt <- appMgr$AggregatedData[[dataName]]
        list(
          name = dataName,
          use = TRUE,
          years = c(min(dt$Year), max(dt$Year))
        )
      }
    )
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'AGGR_DATA_READ',
      Status = 'SUCCESS',
      Payload = list(
        DataFiles = dataFiles,
        PopulationNames = names(appMgr$AggregatedData[[1]])[-1]
      )
    ))
  })

  observeEvent(input$attrMapping, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START',
      Status = 'SUCCESS',
      Payload = list()
    ))

    appMgr$ApplyAttributesMappingToCaseBasedData(input$attrMapping)
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END',
      Status = 'SUCCESS',
      Payload = list()
    ))

    appMgr$PreProcessCaseBasedData()
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_PREPROCESSED',
      Status = 'SUCCESS',
      Payload = list()
    ))

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED',
      Status = 'SUCCESS',
      Payload = list(
        OriginDistribution = appMgr$OriginDistribution
      )
    ))

    type <- 'REPCOUNTRY + UNK + OTHER'
    distr <- appMgr$OriginDistribution
    groups <- GetOriginGroupingPreset(type, distr)
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_SET',
      Status = 'SUCCESS',
      Payload = list(
        OriginGroupingType = type,
        OriginGrouping = groups
      )
    ))
  })

  observeEvent(input$groupingPresetSelect, {
    type <- input$groupingPresetSelect
    distr <- appMgr$OriginDistribution
    groups <- GetOriginGroupingPreset(type, distr)

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_SET',
      Status = 'SUCCESS',
      Payload = list(
        OriginGroupingType = type,
        OriginGrouping = groups
      )
    ))
  })

  observeEvent(input$originGrouping, {
    appMgr$ApplyOriginGrouping(input$originGrouping)

    summaryData <- appMgr$GetSummaryData()
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'SUMMARY_DATA_PREPARED',
      Status = 'SUCCESS',
      Payload = summaryData
    ))
  })

  observeEvent(input$runAdjustBtn, {
    params <- input$runAdjustBtn
    adjustmentSpecs <- GetAdjustmentSpecsWithParams(params)
    appMgr$AdjustCaseBasedData(adjustmentSpecs)
  })

  observeEvent(appMgr$AdjustmentTask$HTMLRunLog, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'ADJUSTMENTS_RUN_LOG_SET',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = appMgr$AdjustmentTask$HTMLRunLog
      )
    ))
  })

  observeEvent(appMgr$AdjustmentTask$Status, {
    if (appMgr$AdjustmentTask$Status == 'RUNNING') {
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'ADJUSTMENTS_RUN_STARTED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    } else if (appMgr$AdjustmentTask$Status == 'STOPPED') {
      appMgr$AdjustedCaseBasedData <- appMgr$AdjustmentTask$Result
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'ADJUSTMENTS_RUN_FINISHED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    }
  })

  observeEvent(appMgr$FinalAdjustedCaseBasedData$Table, {
    dt <- appMgr$FinalAdjustedCaseBasedData$Table
    if (!is.null(dt)) {
      availableStrata <- GetAvailableStrata(appMgr$FinalAdjustedCaseBasedData$Table)
    } else {
      availableStrata <- NULL
    }

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'AVAILABLE_STRATA_SET',
      Status = 'SUCCESS',
      Payload = list(
        AvailableStrata = availableStrata
      )
    ))
  }, ignoreNULL = FALSE)

  observeEvent(input$cancelAdjustBtn, {
    appMgr$CancelAdjustmentTask()
  })

  observeEvent(input$xmlModel, {
    appMgr$HIVModelParameters <- input$xmlModel
  })

  observeEvent(appMgr$HIVModelParameters, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'MODELS_PARAMS_SET',
      Status = 'SUCCESS',
      Payload = list(
        Params = appMgr$HIVModelParameters
      )
    ))
  })

  observeEvent(input$runModelBtn, {
    params <- input$runModelBtn
    print(params)
    appMgr$FitHIVModel(
      settings = list(Verbose = TRUE),
      parameters = params
    )
  })

  observeEvent(appMgr$HIVModelTask$HTMLRunLog, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'MODELS_RUN_LOG_SET',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = appMgr$HIVModelTask$HTMLRunLog
      )
    ))
  })

  observeEvent(appMgr$HIVModelTask$Status, {
    if (appMgr$HIVModelTask$Status == 'RUNNING') {
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'MODELS_RUN_STARTED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    } else if (appMgr$HIVModelTask$Status == 'STOPPED') {
      appMgr$HIVModelResults <- appMgr$HIVModelTask$Result
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'MODELS_RUN_FINISHED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    }
  })

  observeEvent(input$cancelModelBtn, {
    appMgr$CancelHIVModelFit()
  })

  observeEvent(input$runBootstrapBtn, {
    params <- input$runBootstrapBtn
    print(params)
    appMgr$RunBootstrap(
      bsCount = params$count,
      type = params$type
    )
  })

  observeEvent(appMgr$BootstrapTask$HTMLRunLog, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'BOOTSTRAP_RUN_LOG_SET',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = appMgr$BootstrapTask$HTMLRunLog
      )
    ))
  })

  observeEvent(appMgr$BootstrapTask$Status, {
    if (appMgr$BootstrapTask$Status == 'RUNNING') {
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'BOOTSTRAP_RUN_STARTED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    } else if (appMgr$BootstrapTask$Status == 'STOPPED') {
      appMgr$HIVBootstrapModelResults <- appMgr$BootstrapTask$Result
      appMgr$SendEventToReact('shinyHandler', list(
        Type = 'BOOTSTRAP_RUN_FINISHED',
        Status = 'SUCCESS',
        Payload = list()
      ))
    }
  })

  observeEvent(input$cancelBootstrapBtn, {
    appMgr$CancelBootstrapTask()
  })

  observeEvent(input$generateReportBtn, {
    appMgr$GenerateReport()
  })

  observeEvent(appMgr$ReportTask$Status, {
    if (appMgr$ReportTask$Status == "RUNNING") {
      appMgr$SendEventToReact("shinyHandler", list(
        Type = "GENERATING_REPORT_STARTED",
        Status = "SUCCESS",
        Payload = list()
      ))
    } else if (appMgr$ReportTask$Status == "STOPPED") {
      appMgr$Report <- appMgr$ReportTask$Result
      appMgr$SendEventToReact("shinyHandler", list(
        Type = "REPORT_SET",
        Status = "SUCCESS",
        Payload = list(
          Report = appMgr$Report
        )
      ))
    }
  })
}
