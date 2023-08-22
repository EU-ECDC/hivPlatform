Sys.setenv(RSTUDIO_PANDOC = 'c:/SoftDevel/pandoc')
library(data.table)

appMgr <- hivPlatform::AppManager$new()
appMgr$AggrMgr$ReadData('G:/My Drive/Projects/19. PZH/Testing/Bootstrap 4 - dummy miss/Data.zip')
parameters <- ParseXMLModel('G:/My Drive/Projects/19. PZH/Testing/Bootstrap 4 - dummy miss/Model.xml')
names(parameters) <- hivModelling::CapWords(names(parameters))
intervals <- rbindlist(parameters$TimeIntervals)
setnames(intervals, hivModelling::CapWords(colnames(intervals)))
parameters$Intervals <- intervals
parameters$TimeIntervals <- NULL
parameters

appMgr$HIVModelMgr$RunMainFit(
  settings = list(Verbose = FALSE),
  parameters = list(
    ModelMinYear = parameters$MinYear,
    ModelMaxYear = parameters$MaxYear,
    FitPosMinYear = parameters$MinFitPos,
    FitPosMaxYear = parameters$MaxFitPos,
    FitPosCD4MinYear = parameters$MinFitCD4,
    FitPosCD4MaxYear = parameters$MaxFitCD4,
    FitAIDSMinYear = parameters$MinFitAIDS,
    FitAIDSMaxYear = parameters$MaxFitAIDS,
    FitAIDSPosMinYear = parameters$MinFitHIVAIDS,
    FitAIDSPosMaxYear = parameters$MaxFitHIVAIDS,
    Intervals = parameters$Intervals,
    Country = parameters$Country,
    ModelNoKnots = parameters$KnotsCount,
    StartIncZero = parameters$StartIncZero,
    Delta4Fac = parameters$Delta4Fac,
    MaxIncCorr = parameters$MaxIncCorr,
    FullData = parameters$FullData
  ),
  popCombination = list(Case = NULL, Aggr = appMgr$AggrMgr$PopulationNames)
)
