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
    { title: 'Data summary', completed: false, disabled: true},
    { title: 'Adjustments', completed: false, disabled: true},
    { title: 'Modelling', completed: false, disabled: true},
    { title: 'Reports', completed: false, disabled: true},
    { title: 'Outputs', completed: false, disabled: true},
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

  // Shiny custom event handlers
  onShinyEvent = data => {
    if (data.type === 'CASE_BASED_DATA_UPLOADED') {
      this.setCaseBasedDataFileName(data.payload.name[0]);
      this.setCaseBasedDataFileSize(data.payload.size[0]);
      this.setCaseBasedDataFileType(data.payload.type[0]);
      this.setCaseBasedDataPath(data.payload.datapath[0]);
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
    this.fileUploadProgress = progress;
  }

  @action
  setActiveStep = step => {
    this.steps[step].disabled = false;
    this.activeStep = step;
  }

  @action
  setShinyMessage = msg => {
    console.log(msg);
    this.shinyMessage = msg;
  }

}
