DONE:
1. EUROPE => EUROPE-NORTH AMERICA
2. Rename "UNK" to "OTHER" in "Region For Migration.." and combine with "CARIBBEAN..." for migration modelling
3. Add info that records with "UNK" are removed from the dataset processed for migration
4. Reverse order of the X-axis
5. Keep of order conditions in PrepareMigrantData
6. Show count of cases with missing transmission category
7. Add info about combining CARLAM and OTHER
8. Add note that date of diagnosis is the date of diagnosis in the reporting country
9. Check selection of attributes. Currently the focused option is selected.
10. Migrant diagnosis - Show info that we show average and round to the nearest integer
11. Incorporate HIVStatus into KnownPrePost
12. Add tab in "Modelling" -> "Migrant connection" (before "Populations") and enable if migration module was run
13. Make migration connection optional in the modelling module
14. If migrant connection is selected then aggregated data sets override is deselected and inactive, except Dead.
15. Check why there are missings in GroupedRegionOfOrigin.
16. Add three new columns to the outputs of the model, rather than adjusting existing columns

1. Derive the incidence curve as exp(average(log)) over adjusted data set, get average diagnosis rate matrix and compute all HIV model outputs. Use that as the "benchmark" HIV model fit for plots, tables.
2. Research comparison between main fit point estimates and the median of bootstrap
