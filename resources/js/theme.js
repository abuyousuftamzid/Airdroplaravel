import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Public Sans", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    h1: {
      fontSize: '2rem',
      lineHeight: '2.5rem',
    },
    h2: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
    },
    h3: {
      fontSize: '2rem',
      lineHeight: '3rem',
    },
    h4: {
      fontSize: '1.5rem',
      lineHeight: '2.25rem',
    },
    h5: {
      fontSize: '1.188rem',
      lineHeight: '1.813rem',
    },
    h6: {
      fontSize: '18px',
      lineHeight: '28px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        sizeLarge: {
          padding: '12px 24px',
        },
      },
    },
  },
});
