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

    appMgr$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')
    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED',
      Status = 'SUCCESS',
      Payload = list(
        OriginGroupingType = 'REPCOUNTRY + UNK + OTHER'
      )
    ))

    plotDT <- appMgr$PreProcessedCaseBasedData$Table
    counts <- plotDT[, .(Count = .N), keyby = .(Gender, DateOfDiagnosisYear)]
    categories <- sort(unique(counts$DateOfDiagnosisYear))

    appMgr$SendEventToReact('shinyHandler', list(
      Type = 'SUMMARY_DATA_PREPARED',
      Status = 'SUCCESS',
      Payload = list(
        DiagnosisYearFilterData = list(
          ScaleMinYear = min(categories),
          ScaleMaxYear = max(categories),
          ValueMinYear = min(categories),
          ValueMaxYear = max(categories)
        ),
        DiagnosisYearChartCategories = categories,
        DiagnosisYearChartData = list(
          list(
            name = 'Female',
            data = counts[Gender == 'F', Count]
          ),
          list(
            name = 'Male',
            data = counts[Gender == 'M', Count]
          )
        )
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
