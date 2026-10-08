import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3f51b5', light: '#7986cb', dark: '#283593' },
    secondary: { main: '#00bfa5' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
    info: { main: '#0288d1' },
    background: { default: '#f4f6fb', paper: '#ffffff' },
    text: { primary: '#1e2635', secondary: '#5f6b81' }
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h4: { fontWeight: 700, fontFamily: "'Poppins', sans-serif" },
    h5: { fontWeight: 700, fontFamily: "'Poppins', sans-serif" },
    h6: { fontWeight: 600, fontFamily: "'Poppins', sans-serif" },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: { borderRadius: 14 },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'box-shadow 0.3s ease, transform 0.3s ease'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          boxShadow: '0 2px 10px rgba(30,41,59,0.06)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          transition: 'transform 0.2s ease'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 }
      }
    }
  }
});

export default theme;
