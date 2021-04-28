# fileName <- 'D:/Charts.xlsm'
# sheet <- 'DATA'
# data <- appMgr$HIVModelMgr$MainFitResult$`0`$Results$MainOutputs

WriteExcelFile <- function(data,
                           fileName,
                           ...) {
  stopifnot(!missing(data))
  stopifnot(!missing(fileName))

  args <- list(...)

  if (file.exists(fileName)) {
    wb <- openxlsx::loadWorkbook(fileName)
  } else {
    wb <- openxlsx::createWorkbook()
  }

  if ('sheet' %in% names(args) && !(args[['sheet']] %in% names(wb))) {
    openxlsx::addWorksheet(wb = wb, sheetName = args[['sheet']])
  }

  openxlsx::writeData(
    wb = wb,
    x = data,
    sheet = sheet
  )

  openxlsx::saveWorkbook(wb, fileName, overwrite = TRUE)

  return(NULL)
}

# colNames <- c(
#   'year', 'N_HIV_D', 'N_HIV_Obs_M', 'N_CD4_1_D', 'N_CD4_2_D', 'N_CD4_3_D', 'N_CD4_4_D',
#   'N_CD4_1_Obs_M', 'N_CD4_2_Obs_M', 'N_CD4_3_Obs_M', 'N_CD4_4_Obs_M', 'N_AIDS_D', 'N_AIDS_M',
#   'N_HIVAIDS_D', 'N_HIVAIDS_Obs_M', 'N_Inf_M', 't_diag', 'N_Alive', 'N_Alive_Diag_M', 'N_Und',
#   'N_Und_Alive_p', 'N_HIV_Obs_M_LB', 'N_HIV_Obs_M_UB', 'N_CD4_1_Obs_M_LB', 'N_CD4_1_Obs_M_UB',
#   'N_CD4_2_Obs_M_LB', 'N_CD4_2_Obs_M_UB', 'N_CD4_3_Obs_M_LB', 'N_CD4_3_Obs_M_UB',
#   'N_CD4_4_Obs_M_LB', 'N_CD4_4_Obs_M_UB', 'N_AIDS_M_LB', 'N_AIDS_M_UB', 'N_HIVAIDS_Obs_M_LB',
#   'N_HIVAIDS_Obs_M_UB', 'N_Inf_M_LB', 'N_Inf_M_UB', 'N_Alive_LB', 'N_Alive_UB',
#   'N_Alive_Diag_M_LB', 'N_Alive_Diag_M_UB', 'N_Und_LB', 'N_Und_UB', 'N_Und_Alive_p_LB',
#   'N_Und_Alive_p_UB', 'delta1_LB', 'delta1_UB', 'delta2_LB', 'delta2_UB', 'delta3_LB', 'delta3_UB',
#   'delta4_LB', 'delta4_UB', 't_diag_LB', 't_diag_UB'
# )
# colnames(data) %in% colNames
