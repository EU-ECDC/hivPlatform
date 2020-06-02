import { observable, action, configure, computed } from 'mobx';
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
    { title: 'Welcome', completed: false, disabled: false },
    { title: 'Input data upload', completed: false, disabled: true},
    { title: 'Data summary', completed: false, disabled: false},
    { title: 'Adjustments', completed: false, disabled: false},
    { title: 'Modelling', completed: false, disabled: false},
    { title: 'Reports', completed: false, disabled: false},
    { title: 'Outputs', completed: false, disabled: false},
  ];

  @observable
  activeStep = 0;

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
  aggregatedDataFileNames = ['Dead.csv', 'HIV.csv'];

  // Shiny custom event handlers
  onShinyEvent = data => {
    console.log(data);
    if (data.Type === 'CASE_BASED_DATA_UPLOADED') {
      this.setCaseBasedDataFileName(data.Payload.FileName);
      this.setCaseBasedDataPath(data.Payload.FilePath);
      this.setCaseBasedDataFileSize(data.Payload.FileSize);
      this.setCaseBasedDataFileType(data.Payload.FileType);
      this.steps[2].disabled = false;
    } else if (data.Type === 'CASE_BASED_DATA_READ') {
      this.setCaseBasedDataColumnNames(data.Payload.ColumnNames);
      this.setCaseBasedDataRowCount(data.Payload.RowCount);
      this.setCaseBasedDataAttributeMapping(data.Payload.AttributeMapping);
      this.setCaseBasedDataAttributeMappingStatus(data.Payload.AttributeMappingStatus);
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
  get CaseBasedDataColumnNamesString() {
    if (this.caseBasedDataColumnNames === null) {
      return '';
    }
    return this.caseBasedDataColumnNames.join(', ');
  }

  @computed
  get CaseBasedDataAttributeMappingArray() {
    if (this.caseBasedDataAttributeMapping === null) {
      return [];
    }
    return Object.entries(this.caseBasedDataAttributeMapping).map(key => ({ Key: key[0], Val: key[1] }))
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
    this.setActiveStep(1);
  };

  @action setCaseBasedDataFileName = fileName => this.caseBasedDataFileName = fileName;
  @action setCaseBasedDataFileSize = size => this.caseBasedDataFileSize = size;
  @action setCaseBasedDataFileType = type => this.caseBasedDataFileType = type;
  @action setCaseBasedDataPath = path => this.caseBasedDataPath = path;
  @action setCaseBasedDataColumnNames = columnNames => this.caseBasedDataColumnNames = columnNames;
  @action setCaseBasedDataRowCount = rowCount => this.caseBasedDataRowCount = rowCount;
  @action setCaseBasedDataAttributeMapping = attributeMapping => this.caseBasedDataAttributeMapping = attributeMapping;
  @action setCaseBasedDataAttributeMappingStatus = attributeMappingStatus => this.caseBasedDataAttributeMappingStatus = attributeMappingStatus;

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
  setFileUploadProgress = progress => {
    console.log('AppManager:setFileUploadProgress', progress);
    this.fileUploadProgress = progress;
  }

  @action
  setActiveStep = step => {
    this.steps[step].disabled = false;
    this.activeStep = step;
  }

  @action
  setShinyMessage = msg => {
    this.shinyMessage = msg;
  }
}
