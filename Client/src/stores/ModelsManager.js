import { observable, action, computed, makeObservable, autorun, toJS } from 'mobx';
import TimeIntervalsCollectionManager from './TimeIntervalsCollectionManager';
import LoadTxtFile from '../utilities/LoadTxtFile';
import IsNull from '../utilities/IsNull';
import FormatNumber from '../utilities/FormatNumber';
import AddXMLNode from '../utilities/AddXMLNode';
import FormatXML from '../utilities/FormatXML';
import FormatTimeDate from '../utilities/FormatTimeDate';
import FileSaver from 'file-saver';
// import SelectObjectProperties from '../utilities/SelectObjectProperties';

export default class ModelsManager {
  id = 'ModelsManager';
  parentMgr = null;
  timeIntCollMgr = null;

  constructor(mgr) {
    this.parentMgr = mgr;
    this.timeIntCollMgr = new TimeIntervalsCollectionManager(this);

    makeObservable(this, {
      modelsParamFile: observable,
      modelsParamFileName: observable,

      rangeYears: observable,
      optimalYears: observable,

      minYear: observable,
      maxYear: observable,
      minFitPos: observable,
      maxFitPos: observable,
      minFitCD4: observable,
      maxFitCD4: observable,
      minFitAIDS: observable,
      maxFitAIDS: observable,
      minFitHIVAIDS: observable,
      maxFitHIVAIDS: observable,
      fullData: observable,
      knotsCount: observable,
      startIncZero: observable,
      maxIncCorr: observable,
      distributionFit: observable,
      delta4Fac: observable,
      country: observable,
      modelsRunProgress: observable,
      modelsRunLog: observable,
      bootstrapRunProgress: observable,
      bootstrapRunLog: observable,
      bootstrapCount: observable,
      bootstrapType: observable,
      plotData: observable,
      migrConnFlag: observable,
      showConfBounds: observable,
      setModelsParamFile: action,
      saveModelsParamFile: action,
      setModelsParamFileName: action,
      setMinYear: action,
      setMaxYear: action,
      setMinFitPos: action,
      setMaxFitPos: action,
      setMinFitCD4: action,
      setMaxFitCD4: action,
      setMinFitAIDS: action,
      setMaxFitAIDS: action,
      setMinFitHIVAIDS: action,
      setMaxFitHIVAIDS: action,
      setFullData: action,
      setKnotsCount: action,
      setStartIncZero: action,
      setMaxIncCorr: action,
      setDistributionFit: action,
      setDelta4Fac: action,
      setCountry: action,
      setBootstrapCount: action,
      setBootstrapType: action,
      setRangeYears: action,
      setOptimalYears: action,
      runModels: action,
      cancelModels: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      runBootstrap: action,
      cancelBootstrap: action,
      setMigrConnFlag: action,
      setShowConfBounds: action,
      modelsRunInProgress: computed,
      bootstrapRunInProgress: computed,
      gofTable1Data: computed,
      gofTable2Data: computed,
      gofTable3Data: computed,
      gofTable4Data: computed,
      gofTable5Data: computed,
      gofTable6Data: computed,
      gofTable7Data: computed,
      gofPlot1Data: computed,
      gofPlot2Data: computed,
      gofPlot3Data: computed,
      gofPlot4Data: computed,
      gofPlot5Data: computed,
      gofPlot6Data: computed,
      gofPlot7Data: computed,
      outputTable1Data: computed,
      outputTable2Data: computed,
      outputTable3Data: computed,
      outputTable4Data: computed,
      outputPlot1Data: computed,
      outputPlot2Data: computed,
      outputPlot3Data: computed,
      outputPlot4Data: computed,
      mainOutputTableData: computed
    });

    autorun(() => {
      this.timeIntCollMgr.setMinYear(this.minYear);
    });

    autorun(() => {
      this.timeIntCollMgr.setMaxYear(this.maxYear);
    });

    autorun(
      () => this.parentMgr.inputValueSet('migrConnFlag', this.migrConnFlag),
      { delay: 1000 }
    );
  };

  // File details
  modelsParamFile = null;
  modelsParamFileName = '';

  // Parameters
  rangeYears = null;
  optimalYears = null;

  minYear = 1980;
  maxYear = 2016;
  minFitPos = 1979;
  maxFitPos = 1979;
  minFitCD4 = 1984;
  maxFitCD4 = 2016;
  minFitAIDS = 1980;
  maxFitAIDS = 1995;
  minFitHIVAIDS = 1996;
  maxFitHIVAIDS = 2016;

  fullData = true;
  knotsCount = 4;
  startIncZero = true;
  maxIncCorr = true;
  distributionFit = 'POISSON';
  delta4Fac = 0;
  country = 'OTHER';
  bootstrapCount = 100;
  bootstrapType = 'PARAMETRIC';

  // Run details
  modelsRunProgress = null;
  modelsRunLog = null;
  bootstrapRunProgress = null;
  bootstrapRunLog = null;

  // Migration connection
  migrConnFlag = false;

  // Show confidence bounds in outputs
  showConfBounds = true;

  plotData = null;

  colsDescriptions = {
    N_HIV_D: 'Data',
    N_HIV_Obs_M: 'Model',
    N_CD4_1_D: 'Data',
    N_CD4_1_Obs_M: 'Model',
    N_CD4_2_D: 'Data',
    N_CD4_2_Obs_M: 'Model',
    N_CD4_3_D: 'Data',
    N_CD4_3_Obs_M: 'Model',
    N_CD4_4_D: 'Data',
    N_CD4_4_Obs_M: 'Model',
    N_HIVAIDS_D: 'Data',
    N_HIVAIDS_Obs_M: 'Model',
    N_AIDS_D: 'Data',
    N_AIDS_M: 'Model',
    N_Inf_M: 'New incident infections',
    NewMigrantInfectionsPerArrYear: 'New arrivals of infected migrants',
    InfectionsTotal: 'Total',
    t_diag: 'Time to diagnosis',
    N_Alive_Diag_M: 'Diagnosed from model',
    CumNewMigrantDiagnosesPerDiagYear: 'Diagnosed migrants',
    N_Und: 'Undiagnosed from model',
    CumUndiagnosedMigrantCases: 'Undiagnosed migrants',
    AliveTotal: 'Alive',
    N_Und_Alive_p: 'Proportion of undiagnosed',
    UndiagnosedFrac: 'Proportion of undiagnosed'
  };

  setModelsParamFile = paramFile => {
    if (paramFile) {
      this.modelsParamFile = paramFile;
      this.modelsParamFileName = paramFile.name;
      LoadTxtFile(this.modelsParamFile).then(
        action('success', content => {
          this.parentMgr.btnClicked('xmlModel', content);
        }),
        action('error', error => console.log(error))
      );
    }
  };
  saveModelsParamFile = () => {
    const parser = new DOMParser();
    let xmlDoc = parser.parseFromString('<Model></Model>', 'text/xml');
    let modelElem = xmlDoc.getElementsByTagName('Model')[0];
    AddXMLNode(xmlDoc, modelElem, 'FileVersion', 2);

    let metaNode = AddXMLNode(xmlDoc, modelElem, 'Meta');
    AddXMLNode(xmlDoc, metaNode, 'Name', 'HIVModel');
    AddXMLNode(xmlDoc, metaNode, 'Author', 'HIV Platform');
    AddXMLNode(xmlDoc, metaNode, 'Description', 'Model file exported by HIV Platform');
    AddXMLNode(xmlDoc, metaNode, 'InputDataPath', './');
    AddXMLNode(xmlDoc, metaNode, 'OutputResultsPath', './');
    let riskGroupsNode = AddXMLNode(xmlDoc, metaNode, 'RiskGroups');
    let riskGroupNode = AddXMLNode(xmlDoc, riskGroupsNode, 'RiskGroup');
    AddXMLNode(xmlDoc, riskGroupNode, 'Name', 'Default');
    AddXMLNode(xmlDoc, riskGroupNode, 'CreatedByDefault', true);
    AddXMLNode(xmlDoc, riskGroupNode, 'FitMinYear', this.minYear);
    let riskCatagoriesNode = AddXMLNode(xmlDoc, riskGroupNode, 'RiskCategories');
    const popNames = toJS(this.parentMgr.aggrDataMgr.populationNames);
    popNames.forEach(popName => {
      let riskCategoryNode = AddXMLNode(xmlDoc, riskCatagoriesNode, 'RiskCategory');
      AddXMLNode(xmlDoc, riskCategoryNode, 'Name', popName);
      AddXMLNode(xmlDoc, riskCategoryNode, 'IsSelected', true);
    })

    let incidenceModelNode = AddXMLNode(xmlDoc, modelElem, 'IncidenceModel');
    AddXMLNode(xmlDoc, incidenceModelNode, 'Run', 'True');
    AddXMLNode(xmlDoc, incidenceModelNode, 'MinYear', this.minYear);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxYear', this.maxYear);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MinFitPos', this.minFitPos);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxFitPos', this.maxFitPos);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MinFitCD4', this.minFitCD4);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxFitCD4', this.maxFitCD4);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MinFitAIDS', this.minFitAIDS);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxFitAIDS', this.maxFitAIDS);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MinFitHIVAIDS', this.minFitHIVAIDS);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxFitHIVAIDS', this.maxFitHIVAIDS);
    AddXMLNode(xmlDoc, incidenceModelNode, 'Country', this.country);
    AddXMLNode(xmlDoc, incidenceModelNode, 'KnotsCount', this.knotsCount);
    AddXMLNode(xmlDoc, incidenceModelNode, 'StartIncZer', this.startIncZero);
    AddXMLNode(xmlDoc, incidenceModelNode, 'DistributionFit', this.distributionFit);
    AddXMLNode(xmlDoc, incidenceModelNode, 'RDisp', 50);
    AddXMLNode(xmlDoc, incidenceModelNode, 'Delta4Fac', this.delta4Fac);
    AddXMLNode(xmlDoc, incidenceModelNode, 'MaxIncCorr', this.maxIncCorr);
    AddXMLNode(xmlDoc, incidenceModelNode, 'SplineType', 'B-splines');
    AddXMLNode(xmlDoc, incidenceModelNode, 'FullData', this.fullData);
    let bootstrapNode = AddXMLNode(xmlDoc, incidenceModelNode, 'Bootstrap');
    AddXMLNode(xmlDoc, bootstrapNode, 'StartIter', 0);
    AddXMLNode(xmlDoc, bootstrapNode, 'IterCount', this.bootstrapCount);
    let diagnosisRatesNode = AddXMLNode(xmlDoc, incidenceModelNode, 'DiagnosisRates');
    const intervals = toJS(this.timeIntCollMgr.selectedRunCollection.intervals);
    intervals.forEach(
      interval => {
        let intervalNode = AddXMLNode(xmlDoc, diagnosisRatesNode, 'Interval');
        AddXMLNode(xmlDoc, intervalNode, 'Description', 'Test');
        AddXMLNode(xmlDoc, intervalNode, 'StartYear', interval.startYear);
        AddXMLNode(xmlDoc, intervalNode, 'Jump', interval.jump);
        AddXMLNode(xmlDoc, intervalNode, 'ChangingInInterval', interval.changeInInterval);
        AddXMLNode(xmlDoc, intervalNode, 'DifferentByCD4', interval.diffByCD4);
      }
    );

    let londonModelNode = AddXMLNode(xmlDoc, modelElem, 'LondonModel');
    AddXMLNode(xmlDoc, londonModelNode, 'Run', false);
    AddXMLNode(xmlDoc, londonModelNode, 'RunType1', true);
    AddXMLNode(xmlDoc, londonModelNode, 'RunType2', true);
    AddXMLNode(xmlDoc, londonModelNode, 'MinYear', this.minYear);
    AddXMLNode(xmlDoc, londonModelNode, 'MaxYear', this.maxYear);
    AddXMLNode(xmlDoc, londonModelNode, 'BootstrapIterCount', 50000);
    AddXMLNode(xmlDoc, londonModelNode, 'RateW', 2);

    const serializer = new XMLSerializer();
    const modelStr = serializer.serializeToString(xmlDoc);
    const blob = new Blob(
      [['<?xml version="1.0" encoding="utf-8"?>', FormatXML(modelStr)].join('\n')],
      { type: 'text/xml' }
    );
    const timeDateStr = FormatTimeDate(new Date(), 'yyyyMMdd_hhmmss');
    FileSaver.saveAs(blob, `HIVModel_${timeDateStr}.xml`)
  };
  setModelsParamFileName = fileName => this.modelsParamFileName = fileName;
  setRangeYears = rangeYears => this.rangeYears = rangeYears;
  setOptimalYears = optimalYears => {
    this.optimalYears = optimalYears;
    this.setMinYear(optimalYears.All[0]);
    this.setMaxYear(optimalYears.All[1]);
    this.setMinFitPos(optimalYears.HIV[0]);
    this.setMaxFitPos(optimalYears.HIV[1]);
    this.setMinFitCD4(optimalYears.HIVCD4[0]);
    this.setMaxFitCD4(optimalYears.HIVCD4[1]);
    this.setMinFitAIDS(optimalYears.AIDS[0]);
    this.setMaxFitAIDS(optimalYears.AIDS[1]);
    this.setMinFitHIVAIDS(optimalYears.HIVAIDS[0]);
    this.setMaxFitHIVAIDS(optimalYears.HIVAIDS[1]);
  };
  setMinYear = minYear =>
    this.minYear = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(minYear)), this.optimalYears.All[1]);
  setMaxYear = maxYear =>
    this.maxYear = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(maxYear)), this.optimalYears.All[1]);
  setMinFitPos = minFitPos =>
    this.minFitPos = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(minFitPos)), this.optimalYears.All[1]);
  setMaxFitPos = maxFitPos =>
    this.maxFitPos = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(maxFitPos)), this.optimalYears.All[1]);
  setMinFitCD4 = minFitCD4 =>
    this.minFitCD4 = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(minFitCD4)), this.optimalYears.All[1]);
  setMaxFitCD4 = maxFitCD4 =>
    this.maxFitCD4 = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(maxFitCD4)), this.optimalYears.All[1]);
  setMinFitAIDS = minFitAIDS =>
    this.minFitAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(minFitAIDS)), this.optimalYears.All[1]);
  setMaxFitAIDS = maxFitAIDS =>
    this.maxFitAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(maxFitAIDS)), this.optimalYears.All[1]);
  setMinFitHIVAIDS = minFitHIVAIDS =>
    this.minFitHIVAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(minFitHIVAIDS)), this.optimalYears.All[1]);
  setMaxFitHIVAIDS = maxFitHIVAIDS =>
    this.maxFitHIVAIDS = Math.min(Math.max(this.optimalYears.All[0] - 1, parseInt(maxFitHIVAIDS)), this.optimalYears.All[1]);
  setFullData = fullData => this.fullData = fullData;
  setKnotsCount = knotsCount => this.knotsCount = knotsCount;
  setStartIncZero = startIncZero => this.startIncZero = startIncZero;
  setMaxIncCorr = maxIncCorr => this.maxIncCorr = maxIncCorr;
  setDistributionFit = distributionFit => this.distributionFit = distributionFit;
  setDelta4Fac = delta4Fac => this.delta4Fac = parseFloat(delta4Fac);
  setCountry = country => this.country = country;
  setBootstrapCount = bootstrapCount => this.bootstrapCount = bootstrapCount;
  setBootstrapType = bootstrapType => this.bootstrapType = bootstrapType;
  setPlotData = plotData => this.plotData = plotData;

  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  runModels = () => {
    const params = {
      minYear: this.minYear,
      maxYear: this.maxYear,
      minFitPos: this.minFitPos,
      maxFitPos: this.maxFitPos,
      minFitCD4: this.minFitCD4,
      maxFitCD4: this.maxFitCD4,
      minFitAIDS: this.minFitAIDS,
      maxFitAIDS: this.maxFitAIDS,
      minFitHIVAIDS: this.minFitHIVAIDS,
      maxFitHIVAIDS: this.maxFitHIVAIDS,
      fullData: this.fullData,
      knotsCount: this.knotsCount,
      startIncZero: this.startIncZero,
      maxIncCorr: this.maxIncCorr,
      distributionFit: this.distributionFit,
      delta4Fac: this.delta4Fac,
      country: this.country,
      timeIntervals: toJS(this.timeIntCollMgr.selectedRunCollection.intervals),
      popCombination: toJS(this.parentMgr.popCombMgr.selectedCombination)
    };
    this.parentMgr.btnClicked('runModelBtn:HIVModelParams', params);
  };

  cancelModels = () => this.parentMgr.btnClicked('cancelModelBtn');

  setBootstrapRunProgress = progress => this.bootstrapRunProgress = progress;

  setBootstrapRunLog = runLog => this.bootstrapRunLog = runLog;

  runBootstrap = () => this.parentMgr.btnClicked('runBootstrapBtn', {
    count: this.bootstrapCount,
    type: this.bootstrapType
  });

  cancelBootstrap = () => this.parentMgr.btnClicked('cancelBootstrapBtn');

  setMigrConnFlag = flag => this.migrConnFlag = flag;

  setShowConfBounds = show => this.showConfBounds = show;

  get modelsRunInProgress() {
    return this.modelsRunProgress !== null;
  };

  get bootstrapRunInProgress() {
    return this.bootstrapRunProgress !== null;
  };

  get gofTable1Data() {
    return this.getTableData(['Year', 'N_HIV_D', 'N_HIV_Obs_M']);
  };

  get gofPlot1Data() {
    return [this.getPlotSeries('N_HIV_D'), this.getPlotSeries('N_HIV_Obs_M')];
  };

  get gofTable2Data() {
    return this.getTableData(['Year', 'N_CD4_1_D', 'N_CD4_1_Obs_M']);
  };

  get gofPlot2Data() {
    return [this.getPlotSeries('N_CD4_1_D'), this.getPlotSeries('N_CD4_1_Obs_M')];
  };

  get gofTable3Data() {
    return this.getTableData(['Year', 'N_CD4_2_D', 'N_CD4_2_Obs_M']);
  };

  get gofPlot3Data() {
    return [this.getPlotSeries('N_CD4_2_D'), this.getPlotSeries('N_CD4_2_Obs_M')];
  };

  get gofTable4Data() {
    return this.getTableData(['Year', 'N_CD4_3_D', 'N_CD4_3_Obs_M']);
  };

  get gofPlot4Data() {
    return [this.getPlotSeries('N_CD4_3_D'), this.getPlotSeries('N_CD4_3_Obs_M')];
  };

  get gofTable5Data() {
    return this.getTableData(['Year', 'N_CD4_4_D', 'N_CD4_4_Obs_M']);
  };

  get gofPlot5Data() {
    return [this.getPlotSeries('N_CD4_4_D'), this.getPlotSeries('N_CD4_4_Obs_M')];
  };

  get gofTable6Data() {
    return this.getTableData(['Year', 'N_HIVAIDS_D', 'N_HIVAIDS_Obs_M']);
  };

  get gofPlot6Data() {
    return [this.getPlotSeries('N_HIVAIDS_D'), this.getPlotSeries('N_HIVAIDS_Obs_M')];
  };

  get gofTable7Data() {
    return this.getTableData(['Year', 'N_AIDS_D', 'N_AIDS_M']);
  };

  get gofPlot7Data() {
    return [this.getPlotSeries('N_AIDS_D'), this.getPlotSeries('N_AIDS_M')];
  };

  get outputTable1Data() {
    return this.getTableData([
      'Year', 'N_Inf_M', 'NewMigrantDiagnosesPerArrYear', 'InfectionsTotal']
    );
  };

  get outputPlot1Data() {
    return [
      this.getPlotSeries('N_Inf_M'),
      this.getPlotSeries('NewMigrantDiagnosesPerArrYear'),
      this.getPlotSeries('InfectionsTotal')
    ];
  };

  get outputTable2Data() {
    return this.getTableData(['Year', 't_diag']);
  };

  get outputPlot2Data() {
    return [this.getPlotSeries('t_diag')];
  };

  get outputTable3Data() {
    return this.getTableData([
      'Year', 'N_Alive_Diag_M', 'CumNewMigrantDiagnosesPerDiagYear', 'N_Und',
      'CumUndiagnosedMigrantCases', 'AliveTotal'
    ]);
  };

  get outputPlot3Data() {
    return [
      this.getPlotSeries('N_Alive_Diag_M'),
      this.getPlotSeries('CumNewMigrantDiagnosesPerDiagYear'),
      this.getPlotSeries('N_Und'),
      this.getPlotSeries('CumUndiagnosedMigrantCases'),
      this.getPlotSeries('AliveTotal')
    ];
  };

  get outputTable4Data() {
    if (this.migrConnFlag) {
      return this.getTableData(['Year', 'UndiagnosedFrac']);
    } else {
      return this.getTableData(['Year', 'N_Und_Alive_p']);
    }
  };

  get outputPlot4Data() {
    if (this.migrConnFlag) {
      return [this.getPlotSeries('UndiagnosedFrac')];
    } else {
      return [this.getPlotSeries('N_Und_Alive_p')];
    }
  };

  get mainOutputTableData() {
    return this.getTableData([
      'Year',
      'N_HIV_D', 'N_HIV_Obs_M',
      'N_CD4_1_D', 'N_CD4_2_D', 'N_CD4_3_D', 'N_CD4_4_D',
      'N_CD4_1_Obs_M', 'N_CD4_2_Obs_M', 'N_CD4_3_Obs_M', 'N_CD4_4_Obs_M',
      'N_AIDS_D', 'N_AIDS_M',
      'N_HIVAIDS_D', 'N_HIVAIDS_Obs_M',
      'N_Inf_M',
      't_diag', 't_diag_p25', 't_diag_p50', 't_diag_p75',
      'N_Alive', 'N_Alive_Diag_M',
      'N_Und', 'N_Und_Alive_p',
      'N_Und_CD4_3_M', 'N_Und_CD4_4_M'
    ]);
  };

  getTableData = colNames => {
    if (!IsNull(this.plotData)) {
      const values = this.plotData.Year.map((year, i) =>
        colNames.map(colName => this.getTableEntry(colName, i))
      );

      return ({
        colNames: colNames,
        values: values
      });
    } else {
      return null;
    }
  };

  getTableEntry = (colName, i) => {
    if (colName === 'Year') {
      return this.plotData.Year[i];
    }
    const val = this.plotData[colName] ? this.plotData[colName][i] : null;
    if (IsNull(val) || !isFinite(val)) {
      return '';
    }
    if (!this.showConfBounds || !this.plotData[colName + '_LB'] || !this.plotData[colName + '_UB']) {
      return FormatNumber(val);
    }
    let lb = this.plotData[colName + '_LB'] ? this.plotData[colName + '_LB'][i] : null;
    let ub = this.plotData[colName + '_UB'] ? this.plotData[colName + '_UB'][i] : null;
    if (!isFinite(lb) || IsNull(lb)) {
      lb = val;
    }
    if (!isFinite(ub) || IsNull(ub)) {
      ub = val;
    }
    return `${FormatNumber(val)} (${FormatNumber(lb)} - ${FormatNumber(ub)})`;
  };

  getPlotSeries = colName => {
    if (!IsNull(this.plotData)) {
      const values = this.plotData.Year.map((year, i) => [
        year,
        this.plotData[colName] ? this.plotData[colName][i] : null,
        this.plotData[colName + '_LB'] ? this.plotData[colName + '_LB'][i] : null,
        this.plotData[colName + '_UB'] ? this.plotData[colName + '_UB'][i] : null,
        this.plotData[colName + '_Used'] ? this.plotData[colName + '_Used'][i] : true
      ])
      return ({
        name: this.colsDescriptions[colName],
        values: values,
        selected: true
      })
    } else {
      return null;
    }
  };

  setUIState = uiState => {
    this.id = uiState.id;
    this.modelsParamFile = uiState.modelsParamFile;
    this.modelsParamFileName = uiState.modelsParamFileName;
    this.rangeYears = uiState.rangeYears;
    this.optimalYears = uiState.optimalYears;
    this.minYear = uiState.minYear;
    this.maxYear = uiState.maxYear;
    this.minFitPos = uiState.minFitPos;
    this.maxFitPos = uiState.maxFitPos;
    this.minFitCD4 = uiState.minFitCD4;
    this.maxFitCD4 = uiState.maxFitCD4;
    this.minFitAIDS = uiState.minFitAIDS;
    this.maxFitAIDS = uiState.maxFitAIDS;
    this.minFitHIVAIDS = uiState.minFitHIVAIDS;
    this.maxFitHIVAIDS = uiState.maxFitHIVAIDS;
    this.fullData = uiState.fullData;
    this.knotsCount = uiState.knotsCount;
    this.startIncZero = uiState.startIncZero;
    this.maxIncCorr = uiState.maxIncCorr;
    this.distributionFit = uiState.distributionFit;
    this.delta4Fac = uiState.delta4Fac;
    this.country = uiState.country;
    this.bootstrapCount = uiState.bootstrapCount;
    this.bootstrapType = uiState.bootstrapType;
    this.modelsRunProgress = uiState.modelsRunProgress;
    this.modelsRunLog = uiState.modelsRunLog;
    this.bootstrapRunProgress = uiState.bootstrapRunProgress;
    this.bootstrapRunLog = uiState.bootstrapRunLog;
    this.plotData = uiState.plotData;

    const timeIntCollMgr = new TimeIntervalsCollectionManager(this);
    // timeIntCollMgr.setCollections(uiState.timeIntCollMgr.collections);
    // timeIntCollMgr.setMinYear(uiState.timeIntCollMgr.minYear);
    // timeIntCollMgr.setMaxYear(uiState.timeIntCollMgr.maxYear);
    // timeIntCollMgr.setSelectedEditCollectionId(uiState.timeIntCollMgr.selectedEditCollectionId);
    // timeIntCollMgr.setSelectedRunCollectionId(uiState.timeIntCollMgr.selectedRunCollectionId);
    // this.timeIntCollMgr = timeIntCollMgr;
  }
}
