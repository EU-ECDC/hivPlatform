CheckOriginGroupingForMigrant <- function(
  grouping,
  distr
) {
  distrDt <- copy(distr)
  groupingDt <- ConvertListToDt(grouping)

  distrDt[
    groupingDt,
    GroupedRegionOfOrigin := i.name,
    on = .(origin)
  ]

  allowedNames <- c(
    'EUROPE', 'EASTERN EUROPE', 'EUROPE-OTHER',
    'AFRICA', 'SUB-SAHARAN AFRICA', 'AFRICA-OTHER',
    'CARIBBEAN-LATIN AMERICA',
    'OTHER',
    'UNK'
  )

  return(all(toupper(distrDt$GroupedRegionOfOrigin) %chin% toupper(allowedNames)))
}
