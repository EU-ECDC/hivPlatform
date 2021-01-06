import { observable, action, configure, computed, toJS, makeObservable } from 'mobx';
import DefineReactFileInputBinding from '../external/reactFileInputBinding';
import UIStateManager from './UIStateManager'
import NotificationsManager from './NotificationsManager';
import AttrMappingManager from './AttrMappingManager';
import OriginGroupingsManager from './OriginGroupingsManager';
import CaseBasedDataManager from './CaseBasedDataManager';
import AggrDataManager from './AggrDataManager';
import SummaryDataManager from './SummaryDataManager';
import AdjustmentsManager from './AdjustmentsManager';
import PopulationsManager from './PopulationsManager';
import PopCombinationsManager from './PopCombinationsManager';
import ModelsManager from './ModelsManager';

configure({
  enforceActions: 'observed',
  computedRequiresReaction: true,
});

export default class AppManager {
  uiStateMgr = null;
  notificationsMgr = null;
  attrMappingMgr = null;
  origGroupMgr = null;
  caseBasedDataMgr = null;
  aggrDataMgr = null;
  summaryDataMgr = null;
  adjustMgr = null;
  popMgr = null;
  popCombMgr = null;
  modelMgr = null

  shinyState = 'DISCONNECTED';

  shinyMessage = {};

  report = '';

  // Shiny custom event handlers
  onShinyEvent = e => {
    switch (e.type) {
      case 'CASE_BASED_DATA_UPLOADED':
        this.caseBasedDataMgr.setFileName(e.payload.FileName);
        this.caseBasedDataMgr.setFilePath(e.payload.FilePath);
        this.caseBasedDataMgr.setFileSize(e.payload.FileSize);
        this.caseBasedDataMgr.setFileType(e.payload.FileType);
        break;
      case 'CASE_BASED_DATA_READ':
        this.caseBasedDataMgr.setColumnNames(e.payload.ColumnNames);
        this.caseBasedDataMgr.setRecordCount(e.payload.RecordCount);
        this.attrMappingMgr.setMapping(e.payload.AttrMapping);
        this.notificationsMgr.setMsg('Case-based data uploaded');
        break;
      case 'AGGR_DATA_UPLOADED':
        this.aggrDataMgr.setFileName(e.payload.FileName);
        this.aggrDataMgr.setFilePath(e.payload.FilePath);
        this.aggrDataMgr.setFileSize(e.payload.FileSize);
        this.aggrDataMgr.setFileType(e.payload.FileType);
        break;
      case 'AGGR_DATA_READ':
        this.aggrDataMgr.setDataFiles(e.payload.DataFiles);
        this.aggrDataMgr.setPopulationNames(e.payload.PopulationNames);
        this.notificationsMgr.setMsg('Aggregated data uploaded');
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START':
        this.notificationsMgr.setMsg('Applying attribute mapping to case-based data');
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END':
        this.origGroupMgr.setDistribution(e.payload.OriginDistribution);
        this.origGroupMgr.setType(e.payload.OriginGroupingType);
        this.origGroupMgr.setGroupings(e.payload.OriginGrouping);
        this.notificationsMgr.setMsg('Attribute mapping has been applied to case-based data');
        break;
      // case 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED':
      //   this.notificationsMgr.setMsg('Origin grouping applied');
      //   break;
      // case 'SUMMARY_DATA_PREPARED':
      //   this.summaryDataMgr.setDiagYearPlotData(e.payload.DiagYearPlotData);
      //   this.summaryDataMgr.setNotifQuarterPlotData(e.payload.NotifQuarterPlotData);
      //   this.summaryDataMgr.setMissPlotData(e.payload.MissPlotData);
      //   this.summaryDataMgr.setRepDelPlotData(e.payload.RepDelPlotData);
      //   break;
      // case 'ADJUSTMENTS_RUN_STARTED':
      //   this.adjustMgr.setAdjustmentsRunProgress(1);
      //   break;
      // case 'ADJUSTMENTS_RUN_FINISHED':
      //   this.adjustMgr.setAdjustmentsRunProgress(null);
      //   this.notificationsMgr.setMsg('Adjustment run finished');
      //   break;
      // case 'ADJUSTMENTS_RUN_LOG_SET':
      //   this.adjustMgr.setAdjustmentsRunLog(event.Payload.RunLog);
      //   break;
      // case 'AVAILABLE_STRATA_SET':
      //   this.popMgr.setAvailableStrata(event.Payload.AvailableStrata);
      //   break;
      // case 'MODELS_PARAMS_SET':
      //   this.modelMgr.setMinYear(event.Payload.Params.minYear);
      //   this.modelMgr.setMaxYear(event.Payload.Params.maxYear);
      //   this.modelMgr.setMinFitPos(event.Payload.Params.minFitPos);
      //   this.modelMgr.setMaxFitPos(event.Payload.Params.maxFitPos);
      //   this.modelMgr.setMinFitCD4(event.Payload.Params.minFitCD4);
      //   this.modelMgr.setMaxFitCD4(event.Payload.Params.maxFitCD4);
      //   this.modelMgr.setMinFitAIDS(event.Payload.Params.minFitAIDS);
      //   this.modelMgr.setMaxFitAIDS(event.Payload.Params.maxFitAIDS);
      //   this.modelMgr.setMinFitHIVAIDS(event.Payload.Params.minFitHIVAIDS);
      //   this.modelMgr.setMaxFitHIVAIDS(event.Payload.Params.maxFitHIVAIDS);
      //   this.modelMgr.setFullData(event.Payload.Params.fullData);
      //   this.modelMgr.setKnotsCount(event.Payload.Params.knotsCount);
      //   this.modelMgr.setStartIncZero(event.Payload.Params.startIncZero);
      //   this.modelMgr.setMaxIncCorr(event.Payload.Params.maxIncCorr);
      //   this.modelMgr.setDistributionFit(event.Payload.Params.distributionFit);
      //   this.modelMgr.setDelta4Fac(event.Payload.Params.delta4Fac);
      //   this.modelMgr.setCountry(event.Payload.Params.country);
      //   this.modelMgr.setRDisp(event.Payload.Params.rDisp);
      //   this.modelMgr.setSplineType(event.Payload.Params.splineType);
      //   this.modelMgr.timeIntMgr.setIntervals(
      //     event.Payload.Params.minYear,
      //     event.Payload.Params.maxYear,
      //     event.Payload.Params.timeIntervals
      //   );
      //   break;
      // case 'MODELS_RUN_STARTED':
      //   this.modelMgr.setModelsRunProgress(1);
      //   break;
      // case 'MODELS_RUN_LOG_SET':
      //   this.modelMgr.setModelsRunLog(event.Payload.RunLog);
      //   break;
      // case 'MODELS_RUN_FINISHED':
      //   this.modelMgr.setModelsRunProgress(null);
      //   this.notificationsMgr.setMsg('Model run finished');
      //   break;
      // case 'BOOTSTRAP_RUN_STARTED':
      //   this.modelMgr.setBootstrapRunProgress(1);
      //   break;
      // case 'BOOTSTRAP_RUN_LOG_SET':
      //   this.modelMgr.setBootstrapRunLog(event.Payload.RunLog);
      //   break;
      // case 'BOOTSTRAP_RUN_FINISHED':
      //   this.modelMgr.setBootstrapRunProgress(null);
      //   this.notificationsMgr.setMsg('Bootstrap run finished');
      //   break
      // case 'REPORT_SET':
      //   this.setReport(event.Payload.Report);
      //   break;
    };
    this.uiStateMgr.setLastEventType(e.type);
  };

  constructor() {
    this.uiStateMgr = new UIStateManager(this);
    this.notificationsMgr = new NotificationsManager(this);
    this.caseBasedDataMgr = new CaseBasedDataManager(this);
    this.aggrDataMgr = new AggrDataManager(this);
    this.attrMappingMgr = new AttrMappingManager(this);
    this.origGroupMgr = new OriginGroupingsManager(this);
    this.summaryDataMgr = new SummaryDataManager(this);
    this.adjustMgr = new AdjustmentsManager(this);
    this.popMgr = new PopulationsManager(this);
    this.popCombMgr = new PopCombinationsManager(this);
    this.modelMgr = new ModelsManager(this);

    makeObservable(this, {
      shinyState: observable,
      shinyMessage: observable,
      shinyReady: computed,
      jsonShinyMessage: computed,
      setShinyState: action,
      unbindShinyInputs: action,
      bindShinyInputs: action,
      btnClicked: action,
      inputValueSet: action,
      setShinyMessage: action
    });
  };

  // Computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED';
  };

  get jsonShinyMessage() {
    return JSON.stringify(this.shinyMessage);
  };

  // Actions
  setShinyState = state => {
    this.shinyState = state;
    if (state === 'SESSION_INITIALIZED') {
      DefineReactFileInputBinding(this);
      Shiny.addCustomMessageHandler('shinyHandler', this.onShinyEvent);
    }
  };

  setReport = report => this.report = report;

  unbindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.unbindAll();
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  };

  bindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.initializeInputs();
      Shiny.bindAll();
    } else {
      console.log('bindShinyInputs: Shiny is not available');
    }
  };

  btnClicked = (btnId, value = '') => {
    if (this.shinyReady) {
      Shiny.setInputValue(btnId, value, { priority: 'event' });
    } else {
      console.log('btnClicked: Shiny is not available', btnId, toJS(value));
    }
  };

  inputValueSet = (inputId, value) => {
    if (this.shinyReady) {
      Shiny.setInputValue(inputId, value);
    } else {
      console.log('inputValueSet: Shiny is not available', inputId, toJS(value));
    }
  };

  setShinyMessage = msg => {
    this.shinyMessage = msg;
  };
}
