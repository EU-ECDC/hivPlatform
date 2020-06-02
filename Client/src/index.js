import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import 'mobx-react-lite/batchingForReactDom'
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
    $(document).ready(() => {
      $(document).on('shiny:connected', () => appManager.setShinyState('CONNECTED'));
      $(document).on('shiny:sessioninitialized', () => appManager.setShinyState('SESSION_INITIALIZED'));
      $(document).on('shiny:disconnected', () => appManager.setShinyState('DISCONNECTED'));
      $(document).on('shiny:message', () => appManager.setShinyMessage(event.data));
      $(document).on('shiny:inputchanged', () => console.log('shiny:inputchanged:', event.data));
      $(document).on('shiny:filedownload', () => console.log('shiny:filedownload:', event.data));
    });
    runInit(appManager);
  },
);
