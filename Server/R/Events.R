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

    appMgr$ReadCaseBasedData(input$caseUploadBtn$datapath)
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_READ',
      Status = 'SUCCESS',
      Payload = list(
        ColumnNames = colnames(appMgr$CaseBasedData),
        RowCount = nrow(appMgr$CaseBasedData),
        AttributeMapping = appMgr$AttributeMapping,
        AttributeMappingStatus = appMgr$AttributeMappingStatus
      )
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

    type <- appMgr$OriginGroupingType
    distr <- appMgr$OriginDistribution
    dtMap <- GetOriginGroupingMap(type, distr)
    dtList <- ConvertOriginGroupingDtToList(dtMap)

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_SET',
      Status = 'SUCCESS',
      Payload = list(
        OriginGrouping = dtList
      )
    ))

    summaryData <- appMgr$GetSummaryData()
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'SUMMARY_DATA_PREPARED',
    Status = 'SUCCESS',
      Payload = summaryData
    ))
  })

  observeEvent(input$groupingPresetSelect, {
    type <- input$groupingPresetSelect
    appMgr$OriginGroupingType <- type
    distr <- appMgr$OriginDistribution

    groups <- list()
    # groups <- list(
    #   list(Name = 'EUROPE', Regions = c('CENTEUR', 'EASTEUR', 'EUROPE', 'WESTEUR'))
    # )
    dtMap <- GetOriginGroupingMap(type, distr, groups = groups)
    dtList <- ConvertOriginGroupingDtToList(dtMap)

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_SET',
      Status = 'SUCCESS',
      Payload = list(
        OriginGrouping = dtList
      )
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
}
