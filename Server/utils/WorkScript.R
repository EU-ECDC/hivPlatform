appMgr <- hivPlatform::AppManager$new()

# STEP 1 - Load data -------------------------------------------------------------------------------
appMgr$CaseMgr$ReadData('D:/VirtualBox_Shared/dummy_miss1.zip')

# STEP 2 - Pre-process case-based data -------------------------------------------------------------
appMgr$CaseMgr$ApplyAttributesMapping()
appMgr$CaseMgr$ApplyOriginGrouping()

# STEP 3 - Adjust case-based data ------------------------------------------------------------------
adjustmentSpecs <- hivPlatform::GetAdjustmentSpecs('Multiple Imputation using Chained Equations - MICE')
appMgr$CaseMgr$RunAdjustments(adjustmentSpecs)

# STEP 4 - Create adjusted case-based data report --------------------------------------------------
appMgr$CreateReport(
  reportSpec = list(
    name = 'Main Report',
    reportingDelay = TRUE,
    smoothing = FALSE,
    cd4ConfInt = FALSE
  )
)

fileName <- RenderReportToFile(
  reportFilePath = GetReportFileNames()['Main Report'],
  format = 'pdf_document',
  params = appMgr$ReportArtifacts
)
browseURL(fileName)

# STEP 5 - Migration -------------------------------------------------------------------------------
appMgr$CaseMgr$RunMigration()

# STEP 6 - Fit the HIV model -----------------------------------------------------------------------
appMgr$HIVModelMgr$RunMainFit()
appMgr$HIVModelMgr$RunBootstrapFit(bsCount = 10, bsType = 'PARAMETRIC')
