import { observable, action, configure, computed, toJS } from 'mobx';
import DefineReactFileInputBinding from '../external/reactFileInputBinding';
import UIStateManager from './UIStateManager'
import NotificationsManager from './NotificationsManager';
import AttrMappingManager from './AttrMappingManager';
import OriginGroupingsManager from './OriginGroupingsManager';
import CaseBasedDataManager from './CaseBasedDataManager';
import AggrDataManager from './AggrDataManager';
import SummaryDataManager from './SummaryDataManager';
import AdjustmentsManager from './AdjustmentsManager';
import { FreeBreakfastOutlined } from '@material-ui/icons';

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

  @observable
  shinyState = 'DISCONNECTED';

  @observable
  shinyMessage = {};

  @observable
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
    { title: 'Adjustments', completed: false, disabled: false, subSteps: []},
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

  @observable
  activeStepId = 0;

  @observable
  mode = 'NONE';

  @observable
  adjustmentsRunProgress = null;

  @observable
  adjustmentsRunLog = null;

  @observable
  modelsRunProgress = null;

  @observable
  modelsRunLog = null;

  @observable
  bootstrapRunProgress = null;

  @observable
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
        break;
      case 'ADJUSTMENTS_RUN_STARTED':
        this.setAdjustmentsRunLog(event.Payload.RunLog);
        this.setAdjustmentsRunProgress(1);
        break;
      case 'ADJUSTMENTS_RUN_FINISHED':
        this.setAdjustmentsRunLog(event.Payload.RunLog);
        this.setAdjustmentsRunProgress(null);
        this.notificationsMgr.setMsg('Adjustment run finished');
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
  };

  @computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED';
  };

  @computed
  get stepsTitles() {
    const stepTitles = this.steps.map(step => step.title);
    return stepTitles;
  };

  @computed
  get jsonShinyMessage() {
    return JSON.stringify(this.shinyMessage);
  };

  @action
  setShinyState = state => {
    this.shinyState = state;
    if (state === 'SESSION_INITIALIZED') {
      DefineReactFileInputBinding(this);
      Shiny.addCustomMessageHandler('shinyHandler', this.onShinyEvent);
    }
  };

  @action
  setMode = mode => {
    this.mode = mode;
    this.steps[0].completed = true;
    this.setActiveStepId(1);
  };

  @action setAdjustmentsRunProgress = progress => this.adjustmentsRunProgress = progress;
  @action setAdjustmentsRunLog = runLog => this.adjustmentsRunLog = runLog;
  @action setModelsRunProgress = progress => this.modelsRunProgress = progress;
  @action setModelsRunLog = runLog => this.modelsRunLog = runLog;
  @action setBootstrapRunProgress = progress => this.bootstrapRunProgress = progress;
  @action setBootstrapRunLog = runLog => this.bootstrapRunLog = runLog;

  @action
  unbindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.unbindAll();
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  };

  @action
  bindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.bindAll();
    } else {
      console.log('bindShinyInputs: Shiny is not available');
    }
  };

  @action
  btnClicked = btnId => {
    if (this.shinyReady) {
      Shiny.setInputValue(btnId, '', { priority: 'event' });
    } else {
      console.log('btnClicked: Shiny is not available');
    }
  };

  @action
  inputValueSet = (inputId, value) => {
    if (this.shinyReady) {
      Shiny.setInputValue(inputId, value);
    } else {
      console.log('inputValueSet: Shiny is not available', inputId, toJS(value));
    }
  };

  @action
  setActiveStepId = stepId => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
  }

  @action
  setActiveSubStepId = (stepId, subStepId) => {
    this.steps[stepId].disabled = false;
    this.activeStepId = stepId;
    this.steps[stepId].activeSubStepId = subStepId;
  }

  @action
  setShinyMessage = msg => {
    this.shinyMessage = msg;
  }
}
