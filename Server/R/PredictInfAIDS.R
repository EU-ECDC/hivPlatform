PredictInfAIDS <- function(
  input,
  params
) {
  xAIDS <- cbind(
    1,
    as.integer(input$Gender == 'M'),
    input$Age
  )

  output <- copy(input)
  output[, ProbPre := NA_real_]
  for (i in seq_len(nrow(output))) {
    fit1 <- try(integrate(
      VPostWAIDS,
      lower = output$Mig[i],
      upper = output$U[i],
      x = xAIDS[i, ],
      dTime = output$DTime[i],
      betaAIDS = params$betaAIDS,
      kappa = params$kappa
    ), silent = TRUE)

    fit2 <- try(integrate(
      VPostWAIDS,
      lower = 0,
      upper = output$U[i],
      x = xAIDS[i, ],
      dTime = output$DTime[i],
      betaAIDS = params$betaAIDS,
      kappa = params$kappa
    ), silent = TRUE)

    if (IsError(fit1) || IsError(fit2) || fit1$message != 'OK' || fit2$message != 'OK') {
      next
    } else {
      output[i, ProbPre := fit1$value / fit2$value]
    }
  }

  return(output)
}
