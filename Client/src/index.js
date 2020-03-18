import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './App';
import AppManager from './stores/AppManager';

const appManager = new AppManager();

ReactDOM.render(
  <Provider appManager={appManager}>
    <App />
  </Provider>,
  document.getElementById('app')
);
