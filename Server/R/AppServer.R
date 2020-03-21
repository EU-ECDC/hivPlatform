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
  appManager <- AppManager$new(session)

  print(tempdir())

  session$onSessionEnded(function() {
    shiny::stopApp()
  })

  output$mode <- renderText({
    sprintf('Mode: %s', appState$AppManager$Mode)
  })

  Events(input, output, session, appManager)

  return(invisible(NULL))
}
