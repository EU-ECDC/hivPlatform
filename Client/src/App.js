import { hot } from 'react-hot-loader';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import RootElem from './components/RootElem';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#69b023',
    },
  },
  /*
  typography: {
    useNextVariants: true,
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 12,
    caption: {
      fontSize: '0.8rem',
      lineHeight: '1rem',
      fontStyle: 'italic',
    },
    h6: {
      fontSize: '1rem',
    },
  },
  overrides: {
    MuiMenuItem: {
      root: {
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 12,
      },
    },
    MuiIconButton: {
      root: {
        padding: 8,
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  */
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
