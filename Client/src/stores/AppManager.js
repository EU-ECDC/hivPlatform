import { observable, action, configure, computed } from 'mobx';
import DefineReactFileInputBinding from '../external/reactFileInputBinding';

configure({
  enforceActions: 'observed',
});

export default class AppManager {

  @observable
  isProd = false;

  @observable
  mode = 'NONE';

  @observable
  shinyState = 'DISCONNECTED';

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

  // Shiny custom event handlers
  onShinyEventName = val => alert(val);

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

  @action
  setShinyState = state => {
    this.shinyState = state;
    if (state === 'SESSION_INITIALIZED') {
      DefineReactFileInputBinding(this);
    }
  };

  @action
  setMode = mode => {
    this.mode = mode;
    this.steps[0].completed = true;
    this.setActiveStep(1);
  };

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

}
