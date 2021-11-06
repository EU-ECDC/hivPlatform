CheckOriginGroupingForMigrant <- function(
  grouping,
  distr
) {
  if (length(grouping) > 0) {
    distrDt <- copy(distr)
    groupingDt <- ConvertListToDt(grouping)

    distrDt[
      groupingDt,
      GroupedRegionOfOrigin := i.name,
      on = .(origin)
    ]
    distrDt[is.na(GroupedRegionOfOrigin), GroupedRegionOfOrigin := origin]

    allowedNames <- c(
      'EUROPE', 'EASTERN EUROPE', 'EUROPE-OTHER',
      'AFRICA', 'SUB-SAHARAN AFRICA', 'AFRICA-OTHER',
      'ASIA',
      'CARIBBEAN-LATIN AMERICA',
      'OTHER',
      'UNK'
    )

    result <- all(toupper(distrDt$GroupedRegionOfOrigin) %chin% toupper(allowedNames))
  } else {
    result <- FALSE
  }

  return(result)
}
