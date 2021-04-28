# fileName <- 'D:/Charts.xlsm'
# sheetName <- 'DATA'
# data <- appMgr$HIVModelMgr$MainFitResult$`0`$Results$MainOutputs

WriteExcelFile <- function(
  data,
  fileName,
  ...
) {
  stopifnot(!missing(data))
  stopifnot(!missing(fileName))

  if (file.exists(fileName)) {
    wb <- openxlsx::loadWorkbook(fileName)
    openxlsx::writeData(
      wb = wb,
      x = data,
      ...
    )
  }

  openxlsx::saveWorkbook(wb, fileName, overwrite = TRUE)


  return(NULL)
}
