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
        { title: 'Run' },
        { title: 'Tables and charts' }
      ],
      activeSubStepId: 0
    },
    { title: 'Reports', completed: false, disabled: false, subSteps: []},
    { title: 'Outputs', completed: false, disabled: false, subSteps: []},
  ];

  activeStepId = 0;

  mode = 'NONE';

  adjustmentsRunProgress = null;

  adjustmentsRunLog = null;

  modelsRunProgress = null;

  modelsRunLog = null;

  bootstrapRunProgress = null;

  bootstrapRunLog = null;

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
        this.aggrDataMgr.setDataNames(event.Payload.DataNames);
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
        this.setAdjustmentsRunProgress(1);
        break;
      case 'ADJUSTMENTS_RUN_FINISHED':
        this.setAdjustmentsRunProgress(null);
        this.notificationsMgr.setMsg('Adjustment run finished');
        break;
      case 'ADJUSTMENTS_RUN_LOG_SET':
        this.setAdjustmentsRunLog(event.Payload.RunLog);
        break;
      case 'MODEL_RUN_STARTED':
        this.setModelsRunLog(event.Payload.RunLog);
        this.setModelsRunProgress(1);
        break;
      case 'MODEL_RUN_FINISHED':
        this.setModelsRunLog(event.Payload.RunLog);
        this.setModelsRunProgress(null);
        this.notificationsMgr.setMsg('Model run finished');
        break;
      case 'BOOTSTRAP_RUN_STARTED':
        this.setBootstrapRunLog(event.Payload.RunLog);
        this.setBootstrapRunProgress(1);
        break;
      case 'BOOTSTRAP_RUN_PROGRESSES':
        this.setBootstrapRunProgress(event.Payload.Progress);
        break;
      case 'BOOTSTRAP_RUN_FINISHED':
        this.setBootstrapRunLog(event.Payload.RunLog);
        this.setBootstrapRunProgress(null);
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
    makeObservable(this, {
      shinyState: observable,
      shinyMessage: observable,
      steps: observable,
      activeStepId: observable,
      mode: observable,
      adjustmentsRunProgress: observable,
      adjustmentsRunLog: observable,
      modelsRunProgress: observable,
      modelsRunLog: observable,
      bootstrapRunProgress: observable,
      bootstrapRunLog: observable,
      shinyReady: computed,
      stepsTitles: computed,
      jsonShinyMessage: computed,
      adjustmentsRunInProgress: computed,
      setShinyState: action,
      setMode: action,
      setAdjustmentsRunProgress: action,
      setAdjustmentsRunLog: action,
      setModelsRunProgress: action,
      setModelsRunLog: action,
      setBootstrapRunProgress: action,
      setBootstrapRunLog: action,
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

  get adjustmentsRunInProgress() {
    return this.adjustmentsRunProgress !== null;
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

  setAdjustmentsRunProgress = progress => this.adjustmentsRunProgress = progress;
  setAdjustmentsRunLog = runLog => this.adjustmentsRunLog = runLog;
  setModelsRunProgress = progress => this.modelsRunProgress = progress;
  setModelsRunLog = runLog => this.modelsRunLog = runLog;
  setBootstrapRunProgress = progress => this.bootstrapRunProgress = progress;
  setBootstrapRunLog = runLog => this.bootstrapRunLog = runLog;

  unbindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.unbindAll();
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  };

  bindShinyInputs = () => {
    if (this.shinyReady) {
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

  setActiveStepId = stepId => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
  }

  setActiveSubStepId = (stepId, subStepId) => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
    this.steps[stepId].activeSubStepId = subStepId;
  }

  setShinyMessage = msg => {
    this.shinyMessage = msg;
  }
}
