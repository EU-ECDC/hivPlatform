# Test data
popCombinations <- list(
  All1 = list(
    CaseBasedPopulations = c('Gender_M', 'Gender_F'),
    AggrPopulations = c('pop_0', 'pop_1')
  ),
  All2 = list(
    CaseBasedPopulations = c(),
    AggrPopulations = c('pop_0', 'pop_1')
  ),
  Male = list(
    CaseBasedPopulations = c('Gender_M'),
    AggrPopulations = c('pop_0')
  ),
  Female = list(
    CaseBasedPopulations = c('Gender_F'),
    AggrPopulations = c('pop_1')
  ),
  None = list(
    CaseBasedPopulations = c('Gender_FG'),
    AggrPopulations = c()
  ),
  CaseBasedOnly = list(
    CaseBasedPopulations = c('Gender_M'),
    AggrPopulations = c()
  ),
  AggregatedOnly = list(
    CaseBasedPopulations = c('Gender_FG'),
    AggrPopulations = c('pop_0', 'pop_1')
  )
)

popCombination <- popCombinations[['All1']]
expect_identical(popCombination, popCombinations[['All1']])
