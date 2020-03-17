#' AppServer
#'
#' Application server logic
#'
#' @param input Input
#' @param output Output
#' @param session Session
#'
#' @return NULL (invisibly)
#'
#' @export
AppServer <- function(input, output, session)
{
  appState <- reactiveValues(
    AppManager = AppManager$new(reactive = TRUE)
  )

  #callModule(Welcome, 'welcome', appState, session = session)
  #callModule(InputDataUpload, 'upload', appState, session = session)

  session$onSessionEnded(function() {
    shiny::stopApp()
  })

  output$mode <- renderText({
    sprintf('Mode: %s', appState$AppManager$Mode)
  })

  observeEvent(input$foo, {
    print(input$foo)
    session$sendCustomMessage('foo2', 'And I am from R')
  })

  return(invisible(NULL))
}
