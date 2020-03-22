Events <- function(input, output, session, appManager)
{
  observeEvent(input$caseUploadBtn, {

    fileInfo <- input$caseUploadBtn
    print(fileInfo)

    # Case based data uploaded
    appManager$SendEventToReact('shinyHandler', list(
      type = 'CASE_BASED_DATA_UPLOADED',
      status = 'SUCCESS',
      payload = fileInfo
    ))

    appManager$ReadCaseBasedData(input$caseUploadBtn$datapath)
    appManager$SendEventToReact('shinyHandler', list(
      type = 'CASE_BASED_DATA_READ',
      status = 'SUCCESS',
      payload = list(
        colnames(appManager$CaseBasedData),
        nrow(appManager$CaseBasedData)
      )
    ))

    appManager$PreProcessCaseBasedData()
    appManager$SendEventToReact('shinyHandler', list(
      type = 'CASE_BASED_DATA_PREPROCESSED',
      status = 'SUCCESS',
      payload = list()
    ))

    appManager$ApplyOriginGrouping('REPCOUNTRY + UNK + OTHER')
    appManager$SendEventToReact('shinyHandler', list(
      type = 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED',
      status = 'SUCCESS',
      payload = list(
        type = 'REPCOUNTRY + UNK + OTHER'
      )
    ))
  })
}
