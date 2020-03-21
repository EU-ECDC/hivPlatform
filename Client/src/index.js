import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import AppManager from './stores/AppManager';
import jQuery from 'jquery';

// Attach to window for shinyjs
window.jQuery = jQuery;

const appManager = new AppManager();

ReactDOM.render(
  <Provider appManager={appManager}>
    <App />
  </Provider>,
  document.getElementById('app'),
  () => {
    console.log('ReactDOM.render complete');
    jQuery(document).on('shiny:connected', () => appManager.setShinyState('CONNECTED'));
    jQuery(document).on('shiny:sessioninitialized', () => appManager.setShinyState('SESSION_INITIALIZED'));
    jQuery(document).on('shiny:disconnected', () => appManager.setShinyState('DISCONNECTED'));
    jQuery(document).on('shiny:message', () => console.log(event));
  },
);
