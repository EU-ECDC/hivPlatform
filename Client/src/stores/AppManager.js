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

  steps = [
    { title: 'Welcome', completed: false, disabled: false, subSteps: []},
    {
      title: 'Input data upload',
      completed: false,
      disabled: false,
      subSteps: [
        { title: 'Case-based data' },
        { title: 'Aggregated data' }
      ],
      activeSubStepId: 0
    },
    { title: 'Data summary', completed: false, disabled: false, subSteps: []},
    {
      title: 'Adjustments',
      completed: false,
      disabled: false,
      subSteps: [
        { title: 'Inputs' },
        { title: 'Run' },
      ],
      activeSubStepId: 0
    },
    {
      title: 'Modelling',
      completed: false,
      disabled: false,
      subSteps: [
        { title: 'Populations' },
        { title: 'Inputs' },
        { title: 'Advanced' },
        { title: 'Run Main Fit' },
        { title: 'Run Bootstrap' },
        { title: 'Tables and charts' }
      ],
      activeSubStepId: 0
    },
    { title: 'Reports', completed: false, disabled: false, subSteps: []},
    { title: 'Outputs', completed: false, disabled: false, subSteps: []},
  ];

  activeStepId = 0;

  mode = 'NONE';

  // Shiny custom event handlers
  onShinyEvent = event => {
    console.log(event);
    switch (event.Type) {
      case 'CASE_BASED_DATA_UPLOADED':
        this.caseBasedDataMgr.setFileName(event.Payload.FileName);
        this.caseBasedDataMgr.setFilePath(event.Payload.FilePath);
        this.caseBasedDataMgr.setFileSize(event.Payload.FileSize);
        this.caseBasedDataMgr.setFileType(event.Payload.FileType);
        break;
      case 'CASE_BASED_DATA_READ':
        this.caseBasedDataMgr.setColumnNames(event.Payload.ColumnNames);
        this.caseBasedDataMgr.setRecordCount(event.Payload.RecordCount);
        this.attrMappingMgr.setMapping(event.Payload.AttributeMapping);
        this.notificationsMgr.setMsg('Case-based data uploaded');
        break;
      case 'AGGR_DATA_UPLOADED':
        this.aggrDataMgr.setFileName(event.Payload.FileName);
        this.aggrDataMgr.setFilePath(event.Payload.FilePath);
        this.aggrDataMgr.setFileSize(event.Payload.FileSize);
        this.aggrDataMgr.setFileType(event.Payload.FileType);
        break;
      case 'AGGR_DATA_READ':
        this.aggrDataMgr.setDataFiles(event.Payload.DataFiles);
        this.aggrDataMgr.setPopulationNames(event.Payload.PopulationNames);
        this.notificationsMgr.setMsg('Aggregated data uploaded');
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START':
        this.notificationsMgr.setMsg('Applying attribute mapping to case-based data');
        break;
      case 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END':
        this.notificationsMgr.setMsg('Attribute mapping has been applied to case-based data');
        break;
      case 'CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED':
        this.origGroupMgr.setDistribution(event.Payload.OriginDistribution);
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_SET':
        this.origGroupMgr.setType(event.Payload.OriginGroupingType);
        this.origGroupMgr.setGroupings(event.Payload.OriginGrouping);
        break;
      case 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED':
        this.notificationsMgr.setMsg('Origin grouping applied');
        break;
      case 'SUMMARY_DATA_PREPARED':
        this.summaryDataMgr.setDiagYearPlotData(event.Payload.DiagYearPlotData);
        this.summaryDataMgr.setNotifQuarterPlotData(event.Payload.NotifQuarterPlotData);
        this.summaryDataMgr.setMissPlotData(event.Payload.MissPlotData);
        this.summaryDataMgr.setRepDelPlotData(event.Payload.RepDelPlotData);
        break;
      case 'ADJUSTMENTS_RUN_STARTED':
        this.adjustMgr.setAdjustmentsRunProgress(1);
        break;
      case 'ADJUSTMENTS_RUN_FINISHED':
        this.adjustMgr.setAdjustmentsRunProgress(null);
        this.notificationsMgr.setMsg('Adjustment run finished');
        break;
      case 'ADJUSTMENTS_RUN_LOG_SET':
        this.adjustMgr.setAdjustmentsRunLog(event.Payload.RunLog);
        break;
      case 'AVAILABLE_STRATA_SET':
        this.popMgr.setAvailableStrata(event.Payload.AvailableStrata);
        break;
      case 'MODELS_PARAMS_SET':
        this.modelMgr.setMinYear(event.Payload.Params.minYear);
        this.modelMgr.setMaxYear(event.Payload.Params.maxYear);
        this.modelMgr.setMinFitPos(event.Payload.Params.minFitPos);
        this.modelMgr.setMaxFitPos(event.Payload.Params.maxFitPos);
        this.modelMgr.setMinFitCD4(event.Payload.Params.minFitCD4);
        this.modelMgr.setMaxFitCD4(event.Payload.Params.maxFitCD4);
        this.modelMgr.setMinFitAIDS(event.Payload.Params.minFitAIDS);
        this.modelMgr.setMaxFitAIDS(event.Payload.Params.maxFitAIDS);
        this.modelMgr.setMinFitHIVAIDS(event.Payload.Params.minFitHIVAIDS);
        this.modelMgr.setMaxFitHIVAIDS(event.Payload.Params.maxFitHIVAIDS);
        this.modelMgr.setFullData(event.Payload.Params.fullData);
        this.modelMgr.setKnotsCount(event.Payload.Params.knotsCount);
        this.modelMgr.setStartIncZero(event.Payload.Params.startIncZero);
        this.modelMgr.setMaxIncCorr(event.Payload.Params.maxIncCorr);
        this.modelMgr.setDistributionFit(event.Payload.Params.distributionFit);
        this.modelMgr.setDelta4Fac(event.Payload.Params.delta4Fac);
        this.modelMgr.setCountry(event.Payload.Params.country);
        this.modelMgr.setRDisp(event.Payload.Params.rDisp);
        this.modelMgr.setSplineType(event.Payload.Params.splineType);
        this.modelMgr.timeIntMgr.setIntervals(
          event.Payload.Params.minYear,
          event.Payload.Params.maxYear,
          event.Payload.Params.timeIntervals
        );
        break;
      case 'MODELS_RUN_STARTED':
        this.modelMgr.setModelsRunProgress(1);
        break;
      case 'MODELS_RUN_LOG_SET':
        this.modelMgr.setModelsRunLog(event.Payload.RunLog);
        break;
      case 'MODELS_RUN_FINISHED':
        this.modelMgr.setModelsRunProgress(null);
        this.notificationsMgr.setMsg('Model run finished');
        break;
      case 'BOOTSTRAP_RUN_STARTED':
        this.modelMgr.setBootstrapRunLog(event.Payload.RunLog);
        this.modelMgr.setBootstrapRunProgress(1);
        break;
      case 'BOOTSTRAP_RUN_PROGRESSES':
        this.modelMgr.setBootstrapRunProgress(event.Payload.Progress);
        break;
      case 'BOOTSTRAP_RUN_FINISHED':
        this.modelMgr.setBootstrapRunLog(event.Payload.RunLog);
        this.modelMgr.setBootstrapRunProgress(null);
        this.notificationsMgr.setMsg('Bootstrap run finished');
        break
    };
    this.uiStateMgr.setLastEventType(event.Type);
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
      steps: observable,
      activeStepId: observable,
      mode: observable,
      shinyReady: computed,
      stepsTitles: computed,
      jsonShinyMessage: computed,
      setShinyState: action,
      setMode: action,
      unbindShinyInputs: action,
      bindShinyInputs: action,
      btnClicked: action,
      inputValueSet: action,
      setActiveStepId: action,
      setActiveSubStepId: action,
      setShinyMessage: action
    });
  };

  // Computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED';
  };

  get stepsTitles() {
    const stepTitles = this.steps.map(step => step.title);
    return stepTitles;
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

  setMode = mode => {
    this.mode = mode;
    this.steps[0].completed = true;
    this.setActiveStepId(1);
  };

  unbindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.unbindAll(document);
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  };

  bindShinyInputs = () => {
    if (this.shinyReady) {
      DefineReactFileInputBinding(this);
      Shiny.bindAll(document);
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

  setActiveStepId = stepId => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
  };

  setActiveSubStepId = (stepId, subStepId) => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
    this.steps[stepId].activeSubStepId = subStepId;
  };

  setShinyMessage = msg => {
    this.shinyMessage = msg;
  };
}
