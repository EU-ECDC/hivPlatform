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

const appMgr = new AppManager();

ReactDOM.render(
  <Provider appMgr={appMgr}>
    <App />
  </Provider>,
  document.getElementById('app'),
  () => {
    console.log('ReactDOM.render complete');
    $(() => {
      $(document).on('shiny:connected', () => appMgr.setShinyState('CONNECTED'));
      $(document).on('shiny:sessioninitialized', () => appMgr.setShinyState('SESSION_INITIALIZED'));
      $(document).on('shiny:disconnected', () => appMgr.setShinyState('DISCONNECTED'));
      $(document).on('shiny:message', event => appMgr.setShinyMessage(event));
      $(document).on('shiny:inputchanged', event => console.log('shiny:inputchanged:', event));
      $(document).on('shiny:filedownload', event => console.log('shiny:filedownload:', event));
    });
    runInit(appMgr);
  },
);

if (module.hot) {
  module.hot.accept();
}
