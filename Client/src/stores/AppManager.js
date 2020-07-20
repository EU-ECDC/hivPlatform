import { observable, action, configure, computed, toJS } from 'mobx';
import DefineReactFileInputBinding from '../external/reactFileInputBinding';

configure({
  enforceActions: 'observed',
});

export default class AppManager {

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
        { title: 'Run' }
      ],
      activeSubStepId: 0
    },
    { title: 'Reports', completed: false, disabled: false, subSteps: []},
    { title: 'Outputs', completed: false, disabled: false, subSteps: []},
  ];

  @observable
  activeStepId = 0;

  @observable
  fileUploadProgress = null;

  @observable
  mode = 'NONE';

  @observable
  caseBasedDataFileName = null;

  @observable
  caseBasedDataFileSize = null;

  @observable
  caseBasedDataFileType = null;

  @observable
  caseBasedDataPath = null;

  @observable
  caseBasedDataColumnNames = null;

  @observable
  caseBasedDataRowCount = null;

  @observable
  caseBasedDataAttributeMapping = null;

  @observable
  caseBasedDataAttributeMappingStatus = null;

  @observable
  adjustmentsRunProgress = null;

  @observable
  adjustmentsRunLog = null;

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

  @observable
  aggregatedDataFileNames = ['Dead.csv', 'HIV.csv'];

  @observable
  originDistribution = {FullRegionOfOrigin: [], Count: []};

  @observable
  originGrouping = [];

  @observable
  regionGroups = new Map();

  // Shiny custom event handlers
  onShinyEvent = data => {
    console.log(data);
    if (data.Type === 'CASE_BASED_DATA_UPLOADED') {
      this.setCaseBasedDataFileName(data.Payload.FileName);
      this.setCaseBasedDataPath(data.Payload.FilePath);
      this.setCaseBasedDataFileSize(data.Payload.FileSize);
      this.setCaseBasedDataFileType(data.Payload.FileType);
    } else if (data.Type === 'CASE_BASED_DATA_READ') {
      this.setCaseBasedDataColumnNames(data.Payload.ColumnNames);
      this.setCaseBasedDataRowCount(data.Payload.RowCount);
      this.setCaseBasedDataAttributeMapping(data.Payload.AttributeMapping);
      this.setCaseBasedDataAttributeMappingStatus(data.Payload.AttributeMappingStatus);
    } else if (data.Type === 'CASE_BASED_DATA_ORIGIN_DISTR_COMPUTED') {
      this.setOriginDistribution(data.Payload.OriginDistribution);
    } else if (data.Type === 'CASE_BASED_DATA_ORIGIN_GROUPING_SET') {
      this.setOriginGrouping(data.Payload.OriginGrouping);
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
    }
  };

  constructor() { };

  @computed
  get shinyReady() {
    return this.shinyState === 'SESSION_INITIALIZED';
  }

  @computed
  get stepsTitles() {
    const stepTitles = this.steps.map(step => step.title);
    return stepTitles;
  }

  @computed
  get jsonShinyMessage() {
    return JSON.stringify(this.shinyMessage);
  }

  @computed
  get caseBasedDataColumnNamesString() {
    if (this.caseBasedDataColumnNames === null) {
      return '';
    }
    return this.caseBasedDataColumnNames.join(', ');
  }

  @computed
  get caseBasedDataAttributeMappingArray() {
    if (this.caseBasedDataAttributeMapping === null) {
      return [];
    }
    return Object.entries(this.caseBasedDataAttributeMapping).map(key => ({ Key: key[0], Val: key[1] }))
  }

  @computed
  get originDistributionArray() {
    const fullRegionsOfOrigin = this.originDistribution.FullRegionOfOrigin;
    const counts = this.originDistribution.Count;
    return fullRegionsOfOrigin.map((el, i) => ({
      FullRegionOfOrigin: fullRegionsOfOrigin[i],
      Count: counts[i]
    }));
  }

  @computed
  get fullRegionsOfOriginArray() {
    const fullRegionsOfOrigin = this.originDistribution.FullRegionOfOrigin.sort();
    return fullRegionsOfOrigin;
  }

  @computed
  get originGroupingArray() {
    return toJS(this.originGrouping);
  }

  @action
  setShinyState = state => {
    this.shinyState = state;
    if (state === 'SESSION_INITIALIZED') {
      DefineReactFileInputBinding(this);
      window.Shiny.addCustomMessageHandler('shinyHandler', this.onShinyEvent);
    }
  };

  @action
  setMode = mode => {
    this.mode = mode;
    this.steps[0].completed = true;
    this.setActiveStepId(1);
  };

  @action setCaseBasedDataFileName = fileName => this.caseBasedDataFileName = fileName;
  @action setCaseBasedDataFileSize = size => this.caseBasedDataFileSize = size;
  @action setCaseBasedDataFileType = type => this.caseBasedDataFileType = type;
  @action setCaseBasedDataPath = path => this.caseBasedDataPath = path;
  @action setCaseBasedDataColumnNames = columnNames => this.caseBasedDataColumnNames = columnNames;
  @action setCaseBasedDataRowCount = rowCount => this.caseBasedDataRowCount = rowCount;
  @action setCaseBasedDataAttributeMapping = attributeMapping => this.caseBasedDataAttributeMapping = attributeMapping;
  @action setCaseBasedDataAttributeMappingStatus = attributeMappingStatus => this.caseBasedDataAttributeMappingStatus = attributeMappingStatus;
  @action setFileUploadProgress = progress => this.fileUploadProgress = progress;
  @action setAdjustmentsRunProgress = progress => this.adjustmentsRunProgress = progress;
  @action setAdjustmentsRunLog = runLog => this.adjustmentsRunLog = runLog;
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
  @action setOriginDistribution = distr => this.originDistribution = distr;
  @action setOriginGrouping = grouping => {
    // Make sure that FullRegionsOfOrigin are arrays
    const temp = grouping.map(el => {
      const arr = Array.isArray(el.FullRegionsOfOrigin) ? el.FullRegionsOfOrigin : [el.FullRegionsOfOrigin];
      return ({
        GroupedRegionOfOrigin: el.GroupedRegionOfOrigin,
        GroupedRegionOfOriginCount: el.GroupedRegionOfOriginCount,
        FullRegionsOfOrigin: arr
      })
    })

    this.originGrouping = temp;
  }
  @action setRegionGroup = (name, regions) => this.regionGroups.set(name, regions);
  @action removeRegionGroup = name => this.regionGroups.delete(name);

  @action
  unbindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.unbindAll();
    } else {
      console.log('unbindShinyInputs: Shiny is not available');
    }
  }

  @action
  bindShinyInputs = () => {
    if (this.shinyReady) {
      Shiny.bindAll();
    } else {
      console.log('bindShinyInputs: Shiny is not available');
    }
  }

  @action
  btnClicked = btnId => {
    if (this.shinyReady) {
      window.Shiny.setInputValue(btnId, '', { priority: 'event' });
    } else {
      console.log('btnClicked: Shiny is not available');
    }
  };

  @action
  inputValueSet = (inputId, value) => {
    if (this.shinyReady) {
      window.Shiny.setInputValue(inputId, value);
    } else {
      console.log('inputValueSet: Shiny is not available');
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
