import { observable, action, configure, computed } from 'mobx';

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
    { title: 'Welcome', completed: false },
    { title: 'Input data upload', completed: false },
    { title: 'Data summary', completed: false },
    { title: 'Adjustments', completed: false },
    { title: 'Modelling', completed: false },
    { title: 'Reports', completed: false },
    { title: 'Outputs', completed: false },
  ];

  // Shiny custom event handlers
  onShinyEventName = val => alert(val);

  constructor() {
  };

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
  setShinyState = state => this.shinyState = state;

  @action
  setMode = mode => {
    this.mode = mode;
    this.steps[0].completed = true;
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

}
