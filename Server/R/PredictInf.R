PredictInf <- function(
  input,
  params
) {
  integrateMem <- memoise::memoise(integrate)
  on.exit({
    memoise::forget(integrateMem)
  })

  outputAIDS <- copy(input$AIDS)
  outputCD4VL <- copy(input$CD4VL)
  pb <- progress::progress_bar$new(
    format = '[:bar] :current/:total (:percent, Elapsed: :elapsed, ETA: :eta)',
    total = outputAIDS[, .N] + outputCD4VL[, uniqueN(UniqueId)]
  )

  # AIDS -------------------------------------------------------------------------------------------
  xAIDS <- cbind(
    1,
    as.integer(outputAIDS$Gender == 'M'),
    outputAIDS$Age
  )

  outputAIDS[, ProbPre := NA_real_]
  for (i in seq_len(nrow(outputAIDS))) {
    pb$tick()
    fit1 <- try(integrateMem(
      VPostWAIDS,
      lower = outputAIDS$Mig[i], upper = outputAIDS$U[i],
      x = xAIDS[i, ], dTime = outputAIDS$DTime[i],
      betaAIDS = params$betaAIDS, kappa = params$kappa
    ), silent = TRUE)

    fit2 <- try(integrateMem(
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

  # CD4VL ------------------------------------------------------------------------------------------
  outputCD4VL[, ProbPre := NA_real_]
  for (uniqueId in outputCD4VL[, unique(UniqueId)]) {
    pb$tick()

    dt <- outputCD4VL[UniqueId == uniqueId]

    x <- dt[, .(Gender, GroupedRegion, Mode, Age, DTime, Calendar, Consc, Consr)]
    y <- dt[, .(YVar)]
    z <- dt[, .(Consc, CobsTime, Consr, RobsTime, RLogObsTime2, DTime)]
    migTime <- dt[Ord == 1, Mig]
    upTime <- dt[Ord == 1, U]
    xAIDS <- as.matrix(dt[Ord == 1, .(1, as.integer(Gender == 'M'), Age)])
    maxDTime <- dt[, max(DTime)]

    if (dt[Ord == 1, KnownPrePost] != 'Unknown') {
      next
    }

    switch(dt[Ord == 1, Only],
      'Both' = {
        bFE <- params$bFE
        sigma2 <- params$sigma2
        varCovRE <- params$varCovRE
        func <- VPostW
      },
      'CD4 only' = {
        bFE <- params$bFECD4
        sigma2 <- params$sigma2CD4
        varCovRE <- params$varCovRECD4
        func <- VPostWCD4
      },
      'VL only' = {
        bFE <- params$bFEVL
        sigma2 <- params$sigma2VL
        varCovRE <- params$varCovREVL
        func <- VPostWVL
      }
    )

    fit1 <- try(integrateMem(
      func,
      lower = migTime, upper = upTime,
      x = x, y = y, z = z,
      xAIDS = xAIDS, maxDTime = maxDTime,
      betaAIDS = params$betaAIDS, kappa = params$kappa,
      bFE = bFE, sigma2 = sigma2, varCovRE = varCovRE
    ), silent = TRUE)
    fit2 <- try(integrateMem(
      func,
      lower = 0, upper = upTime,
      x = x, y = y, z = z,
      xAIDS = xAIDS, maxDTime = maxDTime,
      betaAIDS = params$betaAIDS, kappa = params$kappa,
      bFE = bFE, sigma2 = sigma2, varCovRE = varCovRE
    ), silent = TRUE)

    if (IsError(fit1) || IsError(fit2) || fit1$message != 'OK' || fit2$message != 'OK') {
      next
    } else {
      outputCD4VL[UniqueId == uniqueId, ProbPre := fit1$value / fit2$value]
    }
  }

  output <- rbind(
    outputAIDS[Ord == 1 & !is.na(ProbPre), .(Imputation, RecordId, ProbPre)],
    outputCD4VL[Ord == 1 & !is.na(ProbPre), .(Imputation, RecordId, ProbPre)]
  )

  return(output)
}
