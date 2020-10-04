#' RunAdjustments
#'
#' Execute adjustments specified in \code{adjustmentFileNames}.
#'
#' @param data data table object on which adjustments should be applied. Required.
#' @param adjustmentSpecs List of adjustment specifications to execute. Optional.
#'   Default = \code{list()}.
#' @param diagYearRange Numeric vector of length two with lower and upper bound for diagnosis year.
#'   Optional. Default = \code{NULL}.
#' @param notifQuarterRange Numeric vector of length two with lower and upper bound for
#'   notification quarter. Optional. Default = \code{NULL}.
#' @param seed Random seed. Optional. Default = NULL
#'
#' @return data table object after adjustments applied.
#'
#' @examples
#' \dontrun{
#' RunAdjustments(data)
#' }
#'
#' @export
RunAdjustments <- function(
  data,
  adjustmentSpecs = list(),
  diagYearRange = NULL,
  notifQuarterRange = NULL,
  seed = NULL
) {
  stopifnot(!missing(data))

  if (is.null(adjustmentSpecs) || length(adjustmentSpecs) == 0) {
    cat('No adjustments to process')
  }

  # Data table performs many operations by reference.
  # We make a copy of the data to make sure the input object is not changed by the adjustment
  # procedures.
  data <- list(Table = data.table::copy(data))
  if (!is.null(diagYearRange)) {
    data$Table <- data$Table[
      HIVDiagnosisYear %between% diagYearRange | is.na(DateOfDiagnosis)
    ]
  }
  if (!is.null(notifQuarterRange)) {
    data$Table <- data$Table[NotificationTime %between% notifQuarterRange | is.na(NotificationTime)]
  }

  PreProcessInputDataBeforeAdjustments(data$Table)

  # Process adjustments
  set.seed(seed)
  results <- list()
  for (i in seq_along(adjustmentSpecs)) {
    adjustmentSpec <- adjustmentSpecs[[i]]

    caption <- sprintf("%d. %s", i, adjustmentSpec$Name)
    if (!"Key" %in% names(adjustmentSpec)) {
      adjustmentSpec$Key <- caption
    }

    cat(sprintf('Adjustment %s', caption), '\n\n')
    # PrintH1('Adjustment {caption}')

    startTime <- Sys.time()
    cat(sprintf('Start time: %s', startTime), '\n\n')

    # Extract parameters for better visibility.
    parameters <- GetParamInfoFromAdjustSpec(adjustmentSpec$Parameters, infoType = "value")

    # PrintH2('Parameters')
    cat('Parameters', '\n')
    print(setNames(as.character(parameters), names(parameters)))

    # Run adjustment function
    output <- adjustmentSpec$AdjustmentFunction(inputData = data$Table, parameters = parameters)

    data <- list(
      Table = output$Table,
      Artifacts = output$Artifacts,
      Parameters = parameters,
      RunIdx = i,
      Name = adjustmentSpec$Name,
      Type = adjustmentSpec$Type,
      SubType = adjustmentSpec$SubType,
      TimeStamp = GetTimeStamp()
    )

    if ('Imputation' %in% colnames(data$Table)) {
      setorderv(data$Table, "Imputation")
    }

    # Store intermediate results for later reference
    results[[adjustmentSpec$Key]] <- data

    endTime <- Sys.time()
    cat('\n')
    cat(sprintf('Done with adjustment %s', caption), '\n')
    cat(sprintf('End time: %s', Sys.time()), '\n')
    cat(sprintf('Elapsed time: %s', prettyunits::pretty_dt(endTime - startTime)), '\n\n\n')


    # PrintAlert('Done with adjustment {.val {caption}}')
  }

  return(results)
}
