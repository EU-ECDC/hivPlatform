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
  })
}
