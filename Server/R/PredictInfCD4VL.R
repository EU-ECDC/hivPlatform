PredictInfCD4VL <- function(
  input,
  params
) {
  output <- copy(input)
  output[, ProbPre := NA_real_]

  pb <- progress::progress_bar$new(
    format = '[:bar] :current/:total (:percent, ETA: :eta)',
    total = output[, uniqueN(UniqueId)]
  )
  for (uniqueId in output[, unique(UniqueId)]) {
    pb$tick()

    dt <- output[UniqueId == uniqueId]

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

    fit1 <- try(integrate(
      func,
      lower = migTime,
      upper = upTime,
      x = x,
      y = y,
      z = z,
      xAIDS = xAIDS,
      maxDTime = maxDTime,
      betaAIDS = params$betaAIDS,
      kappa = params$kappa,
      bFE = bFE,
      sigma2 = sigma2,
      varCovRE = varCovRE
    ), silent = TRUE)
    fit2 <- try(integrate(
      func,
      lower = 0,
      upper = upTime,
      x = x,
      y = y,
      z = z,
      xAIDS = xAIDS,
      maxDTime = maxDTime,
      betaAIDS = params$betaAIDS,
      kappa = params$kappa,
      bFE = bFE,
      sigma2 = sigma2,
      varCovRE = varCovRE
    ), silent = TRUE)

    if (IsError(fit1) || IsError(fit2) || fit1$message != 'OK' || fit2$message != 'OK') {
      next
    } else {
      output[UniqueId == uniqueId, ProbPre := fit1$value / fit2$value]
    }
  }

  return(output)
}
