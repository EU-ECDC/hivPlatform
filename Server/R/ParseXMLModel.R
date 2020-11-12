#' ParseXMLModel
#'
#' Parse XML HIV model
#'
#' @param xml XML string
#'
#' @return list
#'
#' @examples
#' xml <- "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<Model>\r\n  <FileVersion>2</FileVersion>\r\n  <Meta>\r\n    <Name>Full data model</Name>\r\n    <Author></Author>\r\n    <Description></Description>\r\n    <InputDataPath>../Data/test NL</InputDataPath>\r\n    <OutputResultsPath>../Results/FullData</OutputResultsPath>\r\n    <RiskGroups>\r\n      <RiskGroup>\r\n        <Name>pop_0</Name>\r\n        <CreatedByDefault>true</CreatedByDefault>\r\n        <RiskCategories>\r\n          <RiskCategory>\r\n            <Name>pop_0</Name>\r\n            <IsSelected>true</IsSelected>\r\n          </RiskCategory>\r\n        </RiskCategories>\r\n        <FitMinYear>1980</FitMinYear>\r\n      </RiskGroup>\r\n    </RiskGroups>\r\n  </Meta>\r\n  <IncidenceModel>\r\n    <Run>true</Run>\r\n    <MinYear>1980</MinYear>\r\n    <MaxYear>2016</MaxYear>\r\n    <MinFitPos>1979</MinFitPos>\r\n    <MaxFitPos>1979</MaxFitPos>\r\n    <MinFitCD4>1984</MinFitCD4>\r\n    <MaxFitCD4>2016</MaxFitCD4>\r\n    <MinFitAIDS>1980</MinFitAIDS>\r\n    <MaxFitAIDS>1995</MaxFitAIDS>\r\n    <MinFitHIVAIDS>1996</MinFitHIVAIDS>\r\n    <MaxFitHIVAIDS>2016</MaxFitHIVAIDS>\r\n    <DiagnosisRates>\r\n      <Interval>\r\n        <Description>Time interval 1</Description>\r\n        <StartYear>1980</StartYear>\r\n        <Jump>False</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n      <Interval>\r\n        <Description>Time interval 2</Description>\r\n        <StartYear>1984</StartYear>\r\n        <Jump>True</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n      <Interval>\r\n        <Description>Time interval 3</Description>\r\n        <StartYear>1996</StartYear>\r\n        <Jump>False</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n      <Interval>\r\n        <Description>Time interval 4</Description>\r\n        <StartYear>2000</StartYear>\r\n        <Jump>False</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n      <Interval>\r\n        <Description>Time interval 5</Description>\r\n        <StartYear>2005</StartYear>\r\n        <Jump>False</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n      <Interval>\r\n        <Description>Time interval 6</Description>\r\n        <StartYear>2010</StartYear>\r\n        <Jump>False</Jump>\r\n        <ChangingInInterval>False</ChangingInInterval>\r\n        <DifferentByCD4>False</DifferentByCD4>\r\n      </Interval>\r\n    </DiagnosisRates>\r\n    <Country>NL</Country>\r\n    <KnotsCount>6</KnotsCount>\r\n    <StartIncZero>true</StartIncZero>\r\n    <DistributionFit>Negative binomial</DistributionFit>\r\n    <RDisp>50</RDisp>\r\n    <Delta4Fac>0</Delta4Fac>\r\n    <MaxIncCorr>true</MaxIncCorr>\r\n    <SplineType>B-splines</SplineType>\r\n    <FullData>true</FullData>\r\n    <Bootstrap>\r\n      <IterCount>20</IterCount>\r\n      <StartIter>0</StartIter>\r\n    </Bootstrap>\r\n    <LHS>\r\n      <Run>false</Run>\r\n      <StartIter>0</StartIter>\r\n    </LHS>\r\n  </IncidenceModel>\r\n  <LondonModel>\r\n    <Run>false</Run>\r\n    <RunType1>true</RunType1>\r\n    <RunType2>true</RunType2>\r\n    <MinYear>1984</MinYear>\r\n    <MaxYear>2016</MaxYear>\r\n    <BootstrapIterCount>50000</BootstrapIterCount>\r\n    <RateW>2</RateW>\r\n  </LondonModel>\r\n</Model>"
#' ParseXMLModel(xml)
#'
#' @export
ParseXMLModel <- function(
  xml
) {
  params <- xml2::as_list(xml2::read_xml(xml))

  # params$Model$FileVersion[[1]]
  # params$Model$Meta$Name[[1]]
  # params$Model$Meta$Author[[1]]
  # params$Model$Meta$Description[[1]]
  # params$Model$Meta$InputDataPath[[1]]
  # params$Model$Meta$OutputResultsPath[[1]]
  # params$Model$Meta$RiskGroups$RiskGroup$Name[[1]]
  # as.logical(params$Model$Meta$RiskGroups$RiskGroup$CreatedByDefault[[1]])
  # params$Model$Meta$RiskGroups$RiskGroup$RiskCategories$RiskCategory$Name[[1]]
  # as.logical(params$Model$Meta$RiskGroups$RiskGroup$RiskCategories$RiskCategory$IsSelected[[1]])
  # as.integer(params$Model$Meta$RiskGroups$RiskGroup$FitMinYear[[1]])

  timeIntervals <- lapply(unname(params$Model$IncidenceModel$DiagnosisRates), function(el) {
    list(
      startYear = as.integer(el$StartYear[[1]]),
      jump = as.logical(el$Jump[[1]]),
      changeInInterval = as.logical(el$ChangingInInterval[[1]]),
      diffByCD4 = as.logical(el$ChangingInInterval[[1]])
    )
  })

  timeIntervals <- lapply(seq_along(timeIntervals), function(i) {
    timeIntervals[[i]]$endYear <- ifelse(
      i < length(timeIntervals),
      timeIntervals[[i + 1]]$startYear,
      as.integer(params$Model$IncidenceModel$MaxYear[[1]])
    )
    return(timeIntervals[[i]])
  })

  settings <- list(
    minYear = as.integer(params$Model$IncidenceModel$MinYear[[1]]),
    maxYear = as.integer(params$Model$IncidenceModel$MaxYear[[1]]),
    minFitPos = as.integer(params$Model$IncidenceModel$MinFitPos[[1]]),
    maxFitPos = as.integer(params$Model$IncidenceModel$MaxFitPos[[1]]),
    minFitCD4 = as.integer(params$Model$IncidenceModel$MinFitCD4[[1]]),
    maxFitCD4 = as.integer(params$Model$IncidenceModel$MaxFitCD4[[1]]),
    minFitAIDS = as.integer(params$Model$IncidenceModel$MinFitAIDS[[1]]),
    maxFitAIDS = as.integer(params$Model$IncidenceModel$MaxFitAIDS[[1]]),
    minFitHIVAIDS = as.integer(params$Model$IncidenceModel$MinFitHIVAIDS[[1]]),
    maxFitHIVAIDS = as.integer(params$Model$IncidenceModel$MaxFitHIVAIDS[[1]]),
    country = params$Model$IncidenceModel$Country[[1]],
    knotsCount = as.integer(params$Model$IncidenceModel$KnotsCount[[1]]),
    startIncZero = as.logical(params$Model$IncidenceModel$StartIncZero[[1]]),
    distributionFit = ifelse(
      params$Model$IncidenceModel$DistributionFit[[1]] == 'Negative binomial',
      'NEGATIVE_BINOMIAL',
      'POISSON'
    ),
    rDisp = as.integer(params$Model$IncidenceModel$RDisp[[1]]),
    delta4Fac = as.integer(params$Model$IncidenceModel$Delta4Fac[[1]]),
    maxIncCorr = as.logical(params$Model$IncidenceModel$MaxIncCorr[[1]]),
    splineType = ifelse(
      params$Model$IncidenceModel$SplineType[[1]] == 'B-splines',
      'B-SPLINE',
      'M-SPLINE'
    ),
    fullData = as.logical(params$Model$IncidenceModel$FullData[[1]]),
    timeIntervals = timeIntervals
  )

  return(settings)
}
