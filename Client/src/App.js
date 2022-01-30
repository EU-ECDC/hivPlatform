import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import RootElem from './components/RootElem';

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    primary: {
      main: '#69b023',
    },
    secondary: {
      main: '#bedfe1',
    },
  },
  components: {
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: 'black',
          '&.Mui-active': {
            fontWeight: 'bold'
          },
          '&.Mui-completed': {
            fontWeight: 'bold'
          },
          '&.Mui-disabled': {
             color: 'rgba(0, 0, 0, 0.5)',
          },
        },
        iconContainer: {
          '& text': {
            fill: 'white'
          }
        }
      }
    },
    MuiStepConnector: {
      styleOverrides: {
        vertical: {
          marginLeft: '10px'
        }
      }
    },
    MuiStepContent: {
      styleOverrides: {
        root: {
          marginLeft: '10px',
          '& .MuiList-root': {
            paddingBottom: '0px'
          },
          '& .MuiButtonBase-root': {
            padding: '6px',
            fontSize: '0.75rem'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        option: {
          fontSize: '0.75rem'
        }
      }
    },
    MuiTableRow: {
      defaultProps: {
        hover: true
      },
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: '0px'
          },
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(240, 240, 240, 1)',
        },
        head: {
          fontWeight: 'bold',
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard'
      },
      styleOverrides: {
        select: {
          paddingBottom: '5px'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    }
  }
});

const App = () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <RootElem/>
      </React.Fragment>
    </ThemeProvider>
  </StyledEngineProvider>
);

export default App;
