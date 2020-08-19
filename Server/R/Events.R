Events <- function(input, output, session, appMgr)
{
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
        AttributeMapping = appMgr$AttributeMapping
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
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'AGGR_DATA_READ',
      Status = 'SUCCESS',
      Payload = list(
        DataNames = names(appMgr$AggregatedData),
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
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'ADJUSTMENTS_RUN_STARTED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = 'Adjustments run started'
      )
    ))

    adjustmentSpecs <- GetAdjustmentSpecs(c(
      'Multiple Imputation using Chained Equations - MICE'
    ))
    runLog <- capture.output(appMgr$AdjustCaseBasedData(miCount = 2, adjustmentSpecs))
    runLog <- paste(runLog, collapse = '\n')

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'ADJUSTMENTS_RUN_FINISHED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = runLog
      )
    ))
  })

  observeEvent(input$runModelBtn, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'MODEL_RUN_STARTED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = 'Model run started'
      )
    ))

    runLog <- capture.output({
      appMgr$FitHIVModelToAdjustedData(settings = list(Verbose = TRUE))
    })
    runLog <- paste(runLog, collapse = '\n')

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'MODEL_RUN_FINISHED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = runLog
      )
    ))
  })

  observeEvent(input$runBootstrapBtn, {
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'BOOTSTRAP_RUN_STARTED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = 'Bootstrap run started'
      )
    ))

    runLog <- capture.output({
      appMgr$FitHIVModelToBootstrapData(bsCount = 5, verbose = FALSE)
      appMgr$ComputeHIVBootstrapStatistics()
    })
    runLog <- paste(runLog, collapse = '\n')

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'BOOTSTRAP_RUN_FINISHED',
      Status = 'SUCCESS',
      Payload = list(
        RunLog = runLog
      )
    ))
  })
}
