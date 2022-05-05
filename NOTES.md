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
17. Create a new column that is a composite of stratification variables.

TODO:
1. Derive the incidence curve as exp(average(log(BSpline)) over adjusted data set, get average diagnosis rate matrix and compute all HIV model outputs. Use that as the "benchmark" HIV model fit for plots, tables.
2. Research comparison between main fit point estimates and the median of bootstrap
3. If small data set issue a warning that there are too few cases to estimate confidence bounds. Show median as point estimate instead, no bounds.
4. Filter results on length of betas - keep only those that have the length of betas consistent with the length of the levels of factor. Issue a warning when this happens (results are based on a lower number of imputations).
5. Reformat data to have Imputation count times the sample size. Drop incomplete data (strat), (max 10%). Always print out the percent of sample used.
6. Test splines for year of arrival
