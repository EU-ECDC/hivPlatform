#' AppUI
#'
#' Application client logic
#'
#' @return html
#'
#' @export
AppUI <- function() {
  wwwPath <- system.file('app/www', package = 'hivEstimatesAccuracyReloaded')
  shiny::addResourcePath('www', wwwPath)

  tagList(
    f7Page(
      title = 'HIV Platform',
      init = f7Init(
        skin = 'aurora',
        theme = 'light'
      ),
      tags$head(
        tags$link(rel = 'stylesheet', type = 'text/css', href = './www/css/style.css')
      ),
      f7SplitLayout(
        appbar = f7Appbar(
          'HIV Platform',
          textOutput('mode'),
          right_panel = TRUE
        ),
        panels = f7Panel(
          'Right panel',
          title = 'Application Settings',
          side = 'right',
          theme = 'light',
          effect = 'cover',
          resizable = TRUE
        ),
        navbar = NULL,
        sidebar = f7Panel(
          f7PanelMenu(
            f7PanelItem(tabName = 'welcome', title = 'Welcome', active = FALSE),
            f7PanelItem(tabName = 'upload', title = 'Input data upload', active = TRUE),
            f7PanelItem(tabName = 'summary', title = 'Summary', active = FALSE),
            f7PanelItem(tabName = 'adjustments', title = 'Adjustments', active = FALSE)
          ),
          inputId = 'sidebar',
          title = NULL,
          side = 'left',
          theme = 'light',
          effect = 'reveal'
        ),
        tags$div(
          class = 'tabs-wrap',
          tags$div(
            class = 'tabs ios-edges',
            f7Item(tabName = 'welcome', WelcomeUI('welcome')),
            f7Item(tabName = 'upload', InputDataUploadUI('upload')),
            f7Item(tabName = 'summary', 'Tab 2'),
            f7Item(tabName = 'adjustments', 'Tab 3')
          )
        )
      )
    )
  )
}
