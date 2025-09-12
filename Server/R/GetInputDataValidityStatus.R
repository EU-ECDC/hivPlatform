#' GetInputDataValidityStatus
#'
#' Validate input data.
#'
#' @param inputData Input data. Required.
#' @param columnSpecs columnSpecs
#'
#' @return list
#'
#' @examples
#' \dontrun{
#' GetInputDataValidityStatus(inputData)
#' }
#'
#' @export
GetInputDataValidityStatus <- function(
  inputData,
  columnSpecs = NULL
) {
  stopifnot(!missing(inputData))

  inputData <- copy(inputData)

  if (is.null(inputData)) {
    return(NULL)
  }

  if (is.null(columnSpecs)) {
    columnSpecs <- GetListObject(
      GetSystemFile('referenceData/requiredColumns.R'),
      includeFileName = FALSE
    )
  }

  checkStatus <- list()
  for (columnName in names(columnSpecs)) {
    columnSpec <- columnSpecs[[columnName]]
    allowedValues <- columnSpec$values
    restrictedValues <- columnSpec$restrictedValues
    testFuncs <- columnSpec$testFuncs

    wrongValues <- c()

    if (!is.null(restrictedValues)) {
      wrongValues <- c(
        wrongValues,
        restrictedValues[inputData[, restrictedValues %in% unique(get(columnName))]]
      )
    }

    if (!is.null(allowedValues)) {
      wrongValues <- c(
        wrongValues,
        inputData[!get(columnName) %in% c(allowedValues, NA), unique(get(columnName))]
      )
    }

    errorMessages <- c()
    if (!is.null(testFuncs)) {
      for (testFunc in testFuncs) {
        errMsg <- try(testFunc(inputData[[columnName]]), silent = TRUE)
        if (!is.null(errMsg)) {
          errorMessages <- c(errorMessages, errMsg)
        }
      }
    }

    valid <- length(wrongValues) == 0L && length(errorMessages) == 0L

    checkStatus[[columnName]] <- list(
      Valid = valid,
      WrongValues = wrongValues,
      ErrorMessages = errorMessages
    )
  }

  return(list(
    Valid = all(sapply(checkStatus, '[[', 'Valid')),
    CheckStatus = checkStatus
  ))
}
