import { observable, action, configure } from 'mobx';

configure({
  enforceActions: 'observed',
});

export default class AppManager {

  @observable
  isProd = false;

  // Event handlers
  onShinyEventName = val => alert(val);

  constructor() {
    // Set local variables
    this.isProd = typeof window.Shiny !== 'undefined';

    // Bind communication from Shiny to React
    if (this.isProd) {
      window.Shiny.addCustomMessageHandler('eventName', this.onShinyEventName);
    }
  };

  @action
  btnClicked = btnId => {
    if (this.isProd) {
      window.Shiny.setInputValue(btnId, '', {priority: 'event'});
    } else {
      console.log('appManager.btnClicked executed');
    }

  };

  @action
  inputValueSet = (inputId, value) => {
    if (this.isProd) {
      window.Shiny.setInputValue(inputId, value);
    } else {
      console.log('appManager.btnClicked executed');
    }

  };
}
