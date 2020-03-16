InputDataUploadUI <- function(id)
{
  ns <- NS(id)

  tagList(
    div(
      class = 'row',
      div(
        class = 'col',
        f7Card(
          title = 'Input data upload',
          f7Tabs(
            animated = FALSE,
            style = 'toolbar',
            f7Tab(
              tabName = 'Case-based data upload',
              active = TRUE,
              f7Block(
                style = 'margin-top: 20px',
                fileInput(ns('caseFileInput'), label = NULL),
                p(
                  'Maximum file size: 70MB',
                  tags$br(),
                  'Supported files types: rds, txt, csv, xls, xlsx (uncompressed and zip archives)'
                )
              )
            ),
            f7Tab(
              tabName = 'Aggregated data upload',
              active = FALSE,
              f7Block('asd akjshdj asd askjdhkj')
            )
          )
        )
      )
    )
  )
}

InputDataUpload <- function(input, output, session, appState)
{
  mgr <- isolate({appState$AppManager})

}
