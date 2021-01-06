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
      main: '#bedfe1',
    }
  },
  overrides: {
    MuiStepLabel: {
      label: {
        color: 'black',
        '&$active': {
          fontWeight: 'bold'
        },
        '&$completed': {
          fontWeight: 'bold'
        },
      },
      root: {
        '&$disabled': {
          '& .MuiStepLabel-label': {
            color: 'rgba(0, 0, 0, 0.5)',
          }
        },
      },
    },
    MuiStepIcon: {
      root: {
        '& text': {
          fill: 'white'
        }
      }
    },
    MuiStepConnector: {
      vertical: {
        marginLeft: 10
      }
    },
    MuiStepContent: {
      root: {
        marginLeft: 10,
        '& .MuiTreeItem-label': {
          padding: 6,
        },
      }
    },
    MuiTreeItem: {
      label: {
        fontSize: '0.75rem'
      }
    },
    MuiTableRow: {
      root: {
        "&:last-child td": {
          borderBottom: 0,
        },
      }
    },
    MuiTableCell: {
      head: {
        fontWeight: 'bold !important'
      }
    },
    MuiSlider: {
      marked: {
        marginBottom: 0
      }
    },
    MuiSelect: {
      root: {
        paddingLeft: 16,
        paddingBottom: 5
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

export default App;
