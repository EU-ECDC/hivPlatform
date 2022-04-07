ConvertObjToJSON <- function(obj, dataframe = 'rows', asMatrix = FALSE) {
  if (!is.null(obj)) {
    if (asMatrix && is.data.frame(obj)) {
      obj <- list(
        colNames = colnames(obj),
        data = as.matrix(obj)
      )
    }
    json <- jsonlite::toJSON(obj, dataframe = dataframe, auto_unbox = TRUE)
  } else {
    json <- NULL
  }

  return(json)
}
