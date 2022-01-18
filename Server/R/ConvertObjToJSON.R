ConvertObjToJSON <- function(obj, dataframe = 'rows') {
  if (!is.null(obj)) {
    json <- jsonlite::toJSON(obj, dataframe = dataframe, auto_unbox = TRUE)
  } else {
    json <- NULL
  }

  return(json)
}
