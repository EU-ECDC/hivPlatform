AppendRecordIndicators <- function(
  dt
) {
  dt[, ':='(
    FinalData = ifelse1(all(Imputation == 0), Imputation == 0, Imputation != 0),
    UniqueId = rleid(Imputation, RecordId)
  )]

  setcolorder(
    dt,
    union(c('Imputation', 'RecordId', 'UniqueId', 'FinalData'), names(dt))
  )
}
