import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import $ from 'jquery';
import App from './App';
import AppManager from './stores/AppManager';
import runInit from './init';

// Attach to window for shinyjs
window.jQuery = $;
window.$ = $;

const appManager = new AppManager();

ReactDOM.render(
  <Provider appManager={appManager}>
    <App />
  </Provider>,
  document.getElementById('app'),
  () => {
    console.log('ReactDOM.render complete');
    $(() => {
      $(document).on('shiny:connected', () => appManager.setShinyState('CONNECTED'));
      $(document).on('shiny:sessioninitialized', () => appManager.setShinyState('SESSION_INITIALIZED'));
      $(document).on('shiny:disconnected', () => appManager.setShinyState('DISCONNECTED'));
      $(document).on('shiny:message', event => appManager.setShinyMessage(event));
      $(document).on('shiny:inputchanged', event => console.log('shiny:inputchanged:', event));
      $(document).on('shiny:filedownload', event => console.log('shiny:filedownload:', event));
    });
    runInit(appManager);
  },
);

module.hot.accept();
