PredictInf <- function( # nolint
  input,
  params = GetMigrantParams()
) {
  outputAIDS <- copy(input$Data$AIDS)
  outputCD4VL <- copy(input$Data$CD4VL)

  if (is.null(outputAIDS)) {
    outputAIDS <- data.table(
      Imputation = integer(),
      RecordId = character(),
      UniqueId = integer(),
      Ord = integer(),
      ProbPre = numeric()
    )
  }

  if (is.null(outputCD4VL)) {
    outputCD4VL <- data.table(
      Imputation = integer(),
      RecordId = character(),
      UniqueId = integer(),
      Ord = integer(),
      ProbPre = numeric()
    )
  }

  # AIDS -------------------------------------------------------------------------------------------
  xAIDS <- cbind(
    1,
    as.integer(outputAIDS$Gender == 'M'),
    outputAIDS$Age
  )

  countAIDS <- outputAIDS[, .N]
  countAIDSNChar <- nchar(as.character(countAIDS))
  if (countAIDS > 0) {
    outputAIDS[, ProbPre := NA_real_]
  }
  startTime <- Sys.time()
  lastTime <- startTime
  PrintH1('Processing AIDS data')
  PrintAlert('Start time: {format(startTime)}')
  for (i in seq_len(countAIDS)) {
    if (i %% 1000 == 0) {
      currentTime <- Sys.time()
      percComplete <- stringi::stri_pad_left(
        sprintf('%0.2f%%', i / countAIDS * 100),
        width = 8
      )
      iterComplete <- stringi::stri_pad_left(
        sprintf('%d/%d', i, countAIDS),
        width = countAIDSNChar * 2 + 1
      )
      PrintAlert(
        '{percComplete} ({iterComplete}) - {.timestamp {prettyunits::pretty_dt(currentTime - startTime)}}', # nolint
        type = 'success'
      )
      lastTime <- currentTime
    }

    knownPrePost <- outputAIDS$KnownPrePost[i]
    if (knownPrePost != 'Unknown') {
      outputAIDS[i, ProbPre := ifelse(knownPrePost == 'Pre', 1, 0)]
      next
    }

    fit1 <- try(integrate(
      VPostWAIDS,
      lower = outputAIDS$Mig[i], upper = outputAIDS$U[i],
      x = xAIDS[i, ], dTime = outputAIDS$DTime[i],
      betaAIDS = params$betaAIDS, kappa = params$kappa
    ), silent = TRUE)

    fit2 <- try(integrate(
      VPostWAIDS,
      lower = 0, upper = outputAIDS$U[i],
      x = xAIDS[i, ], dTime = outputAIDS$DTime[i],
      betaAIDS = params$betaAIDS, kappa = params$kappa
    ), silent = TRUE)

    if (IsError(fit1) || IsError(fit2) || fit1$message != 'OK' || fit2$message != 'OK') {
      next
    } else {
      outputAIDS[i, ProbPre := fit1$value / fit2$value]
    }
  }
  endTime <- Sys.time()
  if (countAIDS > 0) {
    percComplete <- stringi::stri_pad_left(
      sprintf('%0.2f%%', i / countAIDS * 100),
      width = 8
    )
    iterComplete <- stringi::stri_pad_left(
      sprintf('%d/%d', i, countAIDS),
      width = countAIDSNChar * 2 + 1
    )
    PrintAlert(
      '{percComplete} ({iterComplete}) - {.timestamp {prettyunits::pretty_dt(endTime - startTime)}}', # nolint
      type = 'success'
    )
  } else {
    PrintAlert('No AIDS data to be processed')
  }
  PrintAlert('End time: {format(endTime)}')

  # CD4VL ------------------------------------------------------------------------------------------
  countCD4VL <- outputCD4VL[, uniqueN(UniqueId)]
  countCD4VLNChar <- nchar(as.character(countCD4VL))
  if (countCD4VL > 0) {
    outputCD4VL[, ProbPre := NA_real_]
  }
  i <- 0
  startTime <- Sys.time()
  lastTime <- startTime
  PrintH1('Processing CD4VL data')
  PrintAlert('Start time: {format(startTime)}')
  for (uniqueId in outputCD4VL[, unique(UniqueId)]) {
    i <- i + 1
    if (i %% 1000 == 0) {
      currentTime <- Sys.time()
      percComplete <- stringi::stri_pad_left(
        sprintf('%0.2f%%', i / countCD4VL * 100),
        width = 8
      )
      iterComplete <- stringi::stri_pad_left(
        sprintf('%d/%d', i, countCD4VL),
        width = countCD4VLNChar * 2 + 1
      )
      PrintAlert(
        '{percComplete} ({iterComplete}) - {.timestamp {prettyunits::pretty_dt(currentTime - startTime)}}', # nolint
        type = 'success'
      )
      lastTime <- currentTime
    }

    dt <- outputCD4VL[UniqueId == uniqueId]

    # Predetermined status results in a fixed probability
    knownPrePost <- dt[Ord == 1, KnownPrePost]
    if (knownPrePost %chin% c('Pre', 'Post')) {
      outputCD4VL[UniqueId == uniqueId, ProbPre := fifelse(knownPrePost == 'Pre', 1.0, 0.0)]
      next
    }

    migTime <- dt[Ord == 1, Mig]
    upTime <- dt[Ord == 1, U]
    y <- dt$YVar
    xAIDS <- as.matrix(dt[Ord == 1, .(1, as.integer(Gender == 'M'), Age)])
    maxDTime <- dt[, max(DTime)]
    betaAIDS <- matrix(params$betaAIDS, ncol = 1)
    kappa <- params$kappa
    bFE <- matrix(params$bFE, ncol = 1)
    varCovRE <- params$varCovRE
    formulaeData <- dt[, .(Gender, MigrantRegionOfOrigin, Transmission, Age, DTime, Calendar, Consc, Consr)] # nolint
    fxCD4Data <- formulaeData[Consc == 1]
    baseCD4DM <- GetBaseCD4DesignMatrix(fxCD4Data)
    fxVLData <- formulaeData[Consr == 1]
    baseVLDM <- GetBaseVLDesignMatrix(fxVLData)
    fzData <- dt[, .(Consc, CobsTime, Consr, RobsTime, RLogObsTime2, DTime)]
    baseRandEffDM <- GetBaseRandEffDesignMatrix(fzData)

    sigma2 <- params$sigma2
    errM <- dt$Consc * sigma2[1] + dt$Consr * sigma2[2]
    err <- diag(errM, nrow = length(errM))

    fit1 <- try(IntegratePostWCpp(
      lower = migTime,
      upper = upTime,
      y = y,
      xAIDS = xAIDS,
      maxDTime = maxDTime,
      betaAIDS = betaAIDS,
      kappa = kappa,
      bFE = bFE,
      varCovRE = varCovRE,
      baseCD4DM = baseCD4DM,
      fxCD4Data = fxCD4Data,
      baseVLDM = baseVLDM,
      fxVLData = fxVLData,
      baseRandEffDM = baseRandEffDM,
      fzData = fzData,
      err = err
    ), silent = TRUE)
    fit2 <- try(IntegratePostWCpp(
      lower = 0,
      upper = migTime,
      y = y,
      xAIDS = xAIDS,
      maxDTime = maxDTime,
      betaAIDS = betaAIDS,
      kappa = kappa,
      bFE = bFE,
      varCovRE = varCovRE,
      baseCD4DM = baseCD4DM,
      fxCD4Data = fxCD4Data,
      baseVLDM = baseVLDM,
      fxVLData = fxVLData,
      baseRandEffDM = baseRandEffDM,
      fzData = fzData,
      err = err
    ), silent = TRUE)


    if (IsError(fit1) || IsError(fit2) || fit1$errorCode != 0 || fit2$errorCode != 0) {
      next
    } else {
      outputCD4VL[UniqueId == uniqueId, ProbPre := fit1$value / (fit1$value + fit2$value)]
    }
  }
  endTime <- Sys.time()
  if (countCD4VL > 0) {
      percComplete <- stringi::stri_pad_left(
        sprintf('%0.2f%%', i / countCD4VL * 100),
        width = 8
      )
      iterComplete <- stringi::stri_pad_left(
        sprintf('%d/%d', i, countCD4VL),
        width = countCD4VLNChar * 2 + 1
      )
      PrintAlert(
        '{percComplete} ({iterComplete}) - {.timestamp {prettyunits::pretty_dt(endTime - startTime)}}', # nolint
        type = 'success'
      )
  } else {
    PrintAlert('No CD4VL data to be processed')
  }
  PrintAlert('End time: {format(endTime)}')

  table <- list()
  if (nrow(outputAIDS) > 0) {
    table[['AIDS']] <- outputAIDS[, .(UniqueId, ProbPre)]
  }
  if (nrow(outputCD4VL) > 0) {
    table[['CD4VL']] <- outputCD4VL[Ord == 1, .(UniqueId, ProbPre)]
  }
  table <- rbindlist(table)

  if (nrow(table) == 0) {
    table <- data.table(
      UniqueId = integer(),
      ProbPre = numeric()
    )
  }

  return(table)
}
