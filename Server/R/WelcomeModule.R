WelcomeUI <- function(id)
{
  ns <- NS(id)

  tagList(
    div(
      class = 'row',
      div(class = 'col-25'),
      div(
        class = 'col-50',
        div(
          class = 'row col',
          f7Card(
            title = 'Introduction',
            p('The ECDC HIV Estimates Accuracy Tool is an application that uses advanced statistical
            methods to correct for missing values in key HIV surveillance variables as well as for
            reporting delay, as defined by the time from case diagnosis to notification at the
            national level.'),
            p('The tool accepts case based HIV surveillance data prepared in a specific format.'),
            p('The outputs include results from pre-defined analyses in the form of a report
            containing tables and graphs, and datasets, in which the adjustments have been
            incorporated and which may be exported for further analysis.')
          )
        ),
        div(
          class = 'row',
          div(
            class = 'col',
            f7Card(
              title = '1. Accuracy',
              'Adjust case-based data for missing values and reporting delay',
              footer = tagList(
                f7Button(
                  ns('accuracy'),
                  label = 'Select',
                  shadow = TRUE
                )
              )
            )
          ),
          div(
            class = 'col',
            f7Card(
              title = '2. Modelling',
              'Estimate number of PLHIV and incidence',
              footer = tagList(
                f7Button(
                  ns('modelling'),
                  label = 'Select',
                  shadow = TRUE
                )
              )
            )
          ),
          div(
            class = 'col',
            f7Card(
              title = '3. All-in-one',
              'Accuracy adjustments and modeling integrated in one tool',
              footer = tagList(
                f7Button(
                  ns('all-in-one'),
                  label = 'Select',
                  shadow = TRUE
                )
              )
            )
          )
        )
      ),
      div(class = 'col-25')
    )
  )
}

Welcome <- function(input, output, session, appState)
{
  mgr <- isolate({appState$AppManager})

  observeEvent(input[['accuracy']], {
    mgr$Mode <- 'ACCURACY'
  })

  observeEvent(input[['modelling']], {
    mgr$Mode <- 'MODELLING'
  })

  observeEvent(input[['all-in-one']], {
    mgr$Mode <- 'ALL-IN-ONE'
  })
}
