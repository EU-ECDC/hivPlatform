ConvertObjToJSON <- function(obj) {
  if (!is.null(obj)) {
    json <- jsonlite::toJSON(obj, dataframe = 'rows')
  } else {
    json <- NULL
  }

  return(json)
}
