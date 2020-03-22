Events <- function(input, output, session, appManager)
{
  observeEvent(input$ClickButton, {
    print('input$ClickButton')
    appManager$SendEventToReact('eventName', 'Another abra cadabra')
  })

  observeEvent(input$caseUploadBtn, {
    print(input$caseUploadBtn)
  })
}
