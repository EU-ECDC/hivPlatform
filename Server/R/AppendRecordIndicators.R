AppendRecordIndicators <- function(
  dt
) {
  dt[, FinalData := ifelse1(all(Imputation == 0L), Imputation == 0L, Imputation != 0L)]
  dt[, UniqueId := .GRP, by = .(Imputation, RecordId)]

  setcolorder(
    dt,
    union(c('Imputation', 'RecordId', 'UniqueId', 'FinalData'), names(dt))
  )
}
