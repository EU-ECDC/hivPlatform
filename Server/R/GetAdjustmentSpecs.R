GetAdjustmentSpecs <- function(
  adjustmentNames
) {
  adjustmentFilePaths <- GetAdjustmentSpecFileNames()
  adjustmentSpecs <- setNames(
    lapply(
      adjustmentNames,
      function(adjName) GetListObject(adjustmentFilePaths[adjName])
    ),
    adjustmentNames
  )

  return(adjustmentSpecs)
}
