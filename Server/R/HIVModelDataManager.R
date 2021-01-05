#' HIVModelDataManager
#'
#' R6 class for representing the HIV Model manaager
#'
#' @name HIVModelDataManager
#' @examples
#' hivModelMgr <- HIVModelDataManager$new()
NULL

#' @export
HIVModelDataManager <- R6::R6Class(
  classname = 'HIVModelDataManager',
  class = FALSE,
  cloneable = FALSE,
  public = list(

    # GENERIC METHOD ===============================================================================
    initialize = function(
      session = NULL,
      appMgr = NULL
    ) {
      private$Session <- session
      private$AppMgr <- appMgr
      catalogStorage <- ifelse(!is.null(session), shiny::reactiveValues, list)
      private$Catalogs <- catalogStorage(
        Data = NULL,
        PopCombination = NULL,
        AggrDataSelection = NULL,
        MainFitTask = NULL,
        MainFitResult = NULL,
        BootstrapFitTask = NULL,
        BootstrapFitResult = NULL,
        LastStep = 0L
      )
    },

    print = function() {
      print(self$Session)
    },

    # USER ACTIONS =================================================================================

    # 1. Combine data ------------------------------------------------------------------------------
    CombineData = function(
      popCombination = NULL,
      aggrDataSelection = NULL,
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 0) {
        PrintAlert(
          'HIVModelDataManager is not initialized properly before combining data',
          type = 'danger'
        )
        return(invisible(self))
      }

      status <- 'SUCCESS'
      tryCatch({
        caseData <- private$AppMgr$CaseMgr$Data
        aggrData <- private$AppMgr$AggrMgr$Data
        data <- CombineData(caseData, aggrData, popCombination, aggrDataSelection)
      },
      error = function(e) {
        status <- 'FAIL'
      })

      if (status == 'SUCCESS') {
        private$Reinitialize('CombineData')
        private$Catalogs$Data <- data
        private$Catalogs$PopCombination <- popCombination
        private$Catalogs$AggrDataSelection <- aggrDataSelection
        private$Catalogs$LastStep <- 1L
        PrintAlert('Data has been combined')
      } else {
        PrintAlert('Combining data failed', type = 'danger')
      }

      payload <- list(
        type = 'HIVModelDataManager:CombineData',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    RunMainFit = function(
      settings = list(),
      parameters = list(),
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 1) {
        PrintAlert('Data must be combined before running adjustments', type = 'danger')
        return(invisible(self))
      }

      PrintAlert('Starting HIV Model main fit task')
      status <- 'SUCCESS'
      private$Reinitialize('RunMainFit')
      tryCatch({
        private$Catalogs$MainFitTask <- Task$new(
          function(dataSets, settings, parameters) {
            options(width = 100)

            result <- list()
            for (imp in names(dataSets)) {
              context <- hivModelling::GetRunContext(
                data = dataSets[[imp]],
                settings = settings,
                parameters = parameters
              )
              popData <- hivModelling::GetPopulationData(context)

              startTime <- Sys.time()
              fitResults <- hivModelling::PerformMainFit(context, popData, attemptSimplify = TRUE)
              runTime <- Sys.time() - startTime

              result[[imp]] <- list(
                Context = context,
                PopData = popData,
                Results = fitResults,
                RunTime = runTime,
                Imputation = imp
              )
            }
            return(result)
          },
          args = list(
            dataSets = private$Catalogs$Data,
            settings = settings,
            parameters = parameters
          ),
          session = private$Session,
          successCallback = function(result) {
            private$Catalogs$MainFitResult <- result
            private$Catalogs$LastStep <- 2L
            PrintAlert('Running HIV Model main fit task finished')
          },
          failCallback = function() {
            PrintAlert('Running HIV Model main fit task failed', type = 'danger')
          }
        )
      },
      error = function(e) {
        status <- 'FAIL'
        print(e)
      })

      payload <- list(
        type = 'HIVModelDataManager:RunMainFit',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    CancelMainFit = function() {
      private$Catalogs$MainFitTask$Stop()
      return(invisible(self))
    },

    RunBootstrapFit = function(
      bsCount = 0,
      maxRunTimeFactor = 3,
      type = 'NON-PARAMETRIC',
      callback = NULL
    ) {
      if (private$Catalogs$LastStep < 2) {
        PrintAlert('Main fit must be performed before running bootstrap', type = 'danger')
        return(invisible(self))
      }

      avgRunTime <- mean(sapply(private$Catalogs$MainFitResult, '[[', 'RunTime'))
      maxRunTime <- as.difftime(avgRunTime * maxRunTimeFactor, units = 'secs')

      PrintAlert('Starting HIV Model bootstrap fit task')
      PrintAlert('Maximum allowed run time: {.timestamp {prettyunits::pretty_dt(maxRunTime)}}')
      status <- 'SUCCESS'
      private$Reinitialize('RunBootstrapFit')
      tryCatch({
        private$Catalogs$BootstrapFitTask <- Task$new(
          function(
            bsCount,
            type,
            maxRunTime,
            mainFitResult,
            caseData,
            aggrData,
            popCombination,
            aggrDataSelection
          ) {
            suppressMessages(pkgload::load_all())
            options(width = 100)
            mainCount <- length(mainFitResult)
            result <- list()
            i <- 0
            for (imp in names(mainFitResult)) {
              i <- i + 1
              mainFit <- mainFitResult[[imp]]
              context <- mainFit$Context
              param <- mainFit$Results$Param
              info <- mainFit$Results$Info

              context$Settings <- modifyList(
                context$Settings,
                list(
                  ModelFilePath = NULL,
                  InputDataPath = NULL,
                  Verbose = FALSE
                ),
                keep.null = TRUE
              )

              PrintH2('Imputation {.val {imp}}')

              if (type == 'NON-PARAMETRIC' & !is.null(caseData)) {
                caseDataImp <- caseData[Imputation == as.integer(imp)]
              } else {
                caseDataImp <- NULL
              }

              jSucc <- 1
              j <- 0
              bootResults <- list()
              while (jSucc <= bsCount) {
                j <- j + 1

                # Bootstrap data set
                if (type == 'NON-PARAMETRIC' & !is.null(caseData)) {
                  bootCaseDataImp <- caseDataImp[sample.int(nrow(caseDataImp), replace = TRUE)]
                } else {
                  bootCaseDataImp <- NULL
                }
                bootData <-
                  CombineData(bootCaseDataImp, aggrData, popCombination, aggrDataSelection)[[1]]

                bootContext <- hivModelling::GetRunContext(
                  data = bootData,
                  parameters = context$Parameters,
                  settings = context$Settings
                )

                bootPopData <- hivModelling::GetPopulationData(bootContext)

                startTime <- Sys.time()
                switch(
                  type,
                  'PARAMETRIC' = {
                    bootResult <- hivModelling::PerformBootstrapFit(
                      j, bootContext, bootPopData, mainFit$Results
                    )
                  },
                  'NON-PARAMETRIC' = {
                    bootResult <- hivModelling::PerformMainFit(
                      bootContext, bootPopData,
                      param = param, info = info, attemptSimplify = FALSE,
                      maxRunTime = maxRunTime
                    )
                  }
                )
                runTime <- Sys.time() - startTime

                msgType <- ifelse(bootResult$Converged, 'success', 'danger')

                PrintAlert(
                  'Fit to data set {.val {jSucc}} done |',
                  'Run time: {.timestamp {prettyunits::pretty_dt(runTime)}}',
                  type = msgType
                )

                bootResults[[j]] <- list(
                  Context = bootContext,
                  Data = bootData,
                  Results = bootResult,
                  RunTime = runTime
                )

                if (bootResult$Converged) {
                    jSucc <- jSucc + 1
                }

                progress <- (jSucc - 1 + (i - 1) * bsCount) / (mainCount * bsCount) * 100
              }

              result[[imp]] <- bootResults
            }
            return(result)
          },
          args = list(
            bsCount = 2,
            type = type,
            maxRunTime = maxRunTime,
            mainFitResult = private$Catalogs$MainFitResult,
            caseData = private$AppMgr$CaseMgr$Data,
            aggrData = private$AppMgr$AggrMgr$Data,
            popCombination = popCombination,
            aggrDataSelection = aggrDataSelection
          ),
          session = private$Session,
          successCallback = function(result) {
            private$Catalogs$BootstrapFitResult <- result
            private$Catalogs$LastStep <- 3L
            PrintAlert('Running HIV Model bootstrap fit task finished')
          },
          failCallback = function() {
            PrintAlert('Running HIV Model bootstrap fit task failed', type = 'danger')
          }
        )
      },
      error = function(e) {
        status <- 'FAIL'
        print(e)
      })

      payload <- list(
        type = 'HIVModelDataManager:RunBootstrapFit',
        status = status,
        artifacts = list()
      )

      if (is.function(callback)) {
        callback(payload)
      }

      return(invisible(payload))
    },

    CancelBootstrapFit = function() {
      private$Catalogs$BootstrapFitTask$Stop()
      return(invisible(self))
    }
  ),

  private = list(
    # Shiny session
    Session = NULL,

    # Private application manager
    AppMgr = NULL,

    # Storage
    Catalogs = NULL,

    Reinitialize = function(step) {
      if (step %in% 'CombineData') {
        private$Catalogs$Data <- NULL
        private$Catalogs$PopCombination <- NULL
        private$Catalogs$AggrDataSelection <- NULL
      }

      if (step %in% c('CombineData', 'RunMainFit')) {
        private$Catalogs$MainFitTask <- NULL
        private$Catalogs$MainFitResult <- NULL
      }

      if (step %in% c('CombineData', 'RunMainFit', 'RunBootstrapFit')) {
        private$Catalogs$BootstrapFitTask <- NULL
        private$Catalogs$BootstrapFitResult <- NULL
      }

      lastStep <- switch(
        step,
        'CombineData' = 0L,
        'RunMainFit' = 1L,
        'RunBootstrapFit' = 2L
      )
      private$Catalogs$LastStep <- lastStep
    }
  ),

  active = list(
    Data = function() {
      return(private$Catalogs$Data)
    },

    LastStep = function() {
      return(private$Catalogs$LastStep)
    },

    PopCombination = function() {
      return(private$Catalogs$PopCombination)
    },

    AggrDataSelection = function() {
      return(private$Catalogs$AggrDataSelection)
    },

    MainFitTask = function() {
      return(private$Catalogs$MainFitTask)
    },

    MainFitResult = function() {
      return(private$Catalogs$MainFitResult)
    },

    BootstrapFitTask = function() {
      return(private$Catalogs$BootstrapFitTask)
    },

    BootstrapFitResult = function() {
      return(private$Catalogs$BootstrapFitResult)
    }
  )
)
