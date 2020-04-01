import { hot } from 'react-hot-loader';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import RootElem from './components/RootElem';

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    primary: {
      main: '#69b023',
    },
    secondary: {
      main: '#7cbdc1',
    }
  },
  overrides: {
    MuiStepLabel: {
      active: {
        fontStyle: 'italic !important'
      },
      completed: {
        fontWeight: 'bold !important'
      },
      root: {
        '&$disabled': {
          color: 'red !important'
        },
      },
    },
    MuiStepIcon: {
      text: {
        fill: 'white !important'
      }
    }
  }
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      <RootElem />
    </React.Fragment>
  </MuiThemeProvider>
);

export default hot(module)(App);
