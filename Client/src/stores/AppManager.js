import { observable, action, configure, computed, toJS } from 'mobx';
import DefineReactFileInputBinding from '../external/reactFileInputBinding';
import NotificationsManager from './NotificationsManager';
import AttrMappingManager from './AttrMappingManager';
import OriginGroupingsManager from './OriginGroupingsManager';
import CaseBasedDataManager from './CaseBasedDataManager';
import AggrDataManager from './AggrDataManager';

configure({
  enforceActions: 'observed',
});

export default class AppManager {

  notificationsMgr = null;
  attrMappingMgr = null;
  origGroupMgr = null;
  caseBasedDataMgr = null;
  aggrDataMgr = null;

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
  aggrFileUploadProgress = null;

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

  @observable
  diagnosisYearFilterData = {
    ScaleMinYear: null,
    ScaleMaxYear: null,
    ValueMinYear: null,
    ValueMaxYear: null
  };

  @observable
  diagnosisYearChartData = [];

  @observable
  diagnosisYearChartCategories = [];

  @observable
  notifQuarterFilterData = {
    ScaleMinYear: null,
    ScaleMaxYear: null,
    ValueMinYear: null,
    ValueMaxYear: null
  };

  @observable
  notifQuarterChartData = [];

  @observable
  notifQuarterChartCategories = [];

  // Shiny custom event handlers
  onShinyEvent = data => {
    console.log(data);
    if (data.Type === 'CASE_BASED_DATA_UPLOADED') {
      this.caseBasedDataMgr.setFileName(data.Payload.FileName);
      this.caseBasedDataMgr.setFilePath(data.Payload.FilePath);
      this.caseBasedDataMgr.setFileSize(data.Payload.FileSize);
      this.caseBasedDataMgr.setFileType(data.Payload.FileType);
    } else if (data.Type === 'CASE_BASED_DATA_READ') {
      this.caseBasedDataMgr.setColumnNames(data.Payload.ColumnNames);
      this.caseBasedDataMgr.setRecordCount(data.Payload.RecordCount);
      this.attrMappingMgr.setMapping(data.Payload.AttributeMapping);
      this.notificationsMgr.setMsg('Case based data uploaded');
    } else if (data.Type === 'AGGR_DATA_UPLOADED') {
      this.aggrDataMgr.setFileName(data.Payload.FileName);
      this.aggrDataMgr.setFilePath(data.Payload.FilePath);
      this.aggrDataMgr.setFileSize(data.Payload.FileSize);
      this.aggrDataMgr.setFileType(data.Payload.FileType);
    } else if (data.Type === 'AGGR_DATA_READ') {
      this.aggrDataMgr.setDataNames(data.Payload.DataNames);
      this.aggrDataMgr.setPopulationNames(data.Payload.PopulationNames);
      this.notificationsMgr.setMsg('Aggregated data uploaded');
    } else if (data.Type === 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_START') {
      this.notificationsMgr.setMsg('Applying attribute mapping to case-based data');
    } else if (data.Type === 'CASE_BASED_ATTRIBUTE_MAPPING_APPLY_END') {
      this.notificationsMgr.setMsg('Attribute mapping has been applied to case-based data');
    } else if (data.Type === 'CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED') {
      this.origGroupMgr.setDistribution(data.Payload.OriginDistribution);
    } else if (data.Type === 'CASE_BASED_DATA_ORIGIN_GROUPING_SET') {
      this.origGroupMgr.setType(data.Payload.OriginGroupingType);
      this.origGroupMgr.setGroupings(data.Payload.OriginGrouping);
    } else if (data.Type === 'CASE_BASED_DATA_ORIGIN_GROUPING_APPLIED') {
      this.notificationsMgr.setMsg('Origin grouping applied');
    } else if (data.Type === 'SUMMARY_DATA_PREPARED') {
      this.setDiagnosisYearFilterData(data.Payload.DiagnosisYearFilterData);
      this.setDiagnosisYearChartData(data.Payload.DiagnosisYearChartData);
      this.setDiagnosisYearChartCategories(data.Payload.DiagnosisYearChartCategories);
      this.setNotifQuarterFilterData(data.Payload.NotifQuarterFilterData);
      this.setNotifQuarterChartData(data.Payload.NotifQuarterChartData);
      this.setNotifQuarterChartCategories(data.Payload.NotifQuarterChartCategories);
    } else if (data.Type === 'ADJUSTMENTS_RUN_STARTED') {
      this.setAdjustmentsRunLog(data.Payload.RunLog);
      this.setAdjustmentsRunProgress(1);
    } else if (data.Type === 'ADJUSTMENTS_RUN_FINISHED') {
      this.setAdjustmentsRunLog(data.Payload.RunLog);
      this.setAdjustmentsRunProgress(null);
      this.notificationsMgr.setMsg('Adjustment run finished');
    } else if(data.Type === 'MODEL_RUN_STARTED') {
      this.setModelsRunLog(data.Payload.RunLog);
      this.setModelsRunProgress(1);
    } else if (data.Type === 'MODEL_RUN_FINISHED') {
      this.setModelsRunLog(data.Payload.RunLog);
      this.setModelsRunProgress(null);
      this.notificationsMgr.setMsg('Model run finished');
    } else if (data.Type === 'BOOTSTRAP_RUN_STARTED') {
      this.setBootstrapRunLog(data.Payload.RunLog);
      this.setBootstrapRunProgress(1);
    } else if (data.Type === 'BOOTSTRAP_RUN_PROGRESSES') {
      this.setBootstrapRunProgress(data.Payload.Progress);
    } else if (data.Type === 'BOOTSTRAP_RUN_FINISHED') {
      this.setBootstrapRunLog(data.Payload.RunLog);
      this.setBootstrapRunProgress(null);
      this.notificationsMgr.setMsg('Bootstrap run finished');
    }
  };

  constructor() {
    this.notificationsMgr = new NotificationsManager(this);
    this.caseBasedDataMgr = new CaseBasedDataManager(this);
    this.aggrDataMgr = new AggrDataManager(this);
    this.attrMappingMgr = new AttrMappingManager(this);
    this.origGroupMgr = new OriginGroupingsManager(this);
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
  @action setDiagnosisYearFilterData = data => {
    this.diagnosisYearFilterData.ScaleMinYear = data.ScaleMinYear;
    this.diagnosisYearFilterData.ScaleMaxYear = data.ScaleMaxYear;
    this.diagnosisYearFilterData.ValueMinYear = data.ValueMinYear;
    this.diagnosisYearFilterData.ValueMaxYear = data.ValueMaxYear;
  };
  @action setDiagnosisYearChartData = data => this.diagnosisYearChartData = data;
  @action setDiagnosisYearChartCategories = categories => this.diagnosisYearChartCategories = categories;
  @action setNotifQuarterFilterData = data => {
    this.notifQuarterFilterData.ScaleMinYear = data.ScaleMinYear;
    this.notifQuarterFilterData.ScaleMaxYear = data.ScaleMaxYear;
    this.notifQuarterFilterData.ValueMinYear = data.ValueMinYear;
    this.notifQuarterFilterData.ValueMaxYear = data.ValueMaxYear;
  };
  @action setNotifQuarterChartData = data => this.notifQuarterChartData = data;
  @action setNotifQuarterChartCategories = categories => this.notifQuarterChartCategories = categories;

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
