import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext';
import App from './App';
import './index.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Light theme palette
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#667eea',
    light: '#9bb5ff',
    dark: '#3f51b5',
  },
  secondary: {
    main: '#764ba2',
    light: '#a478d4',
    dark: '#4a2c73',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
  },
  success: { main: '#10b981' },
  warning: { main: '#f59e0b' },
  error: { main: '#ef4444' },
};

// Dark theme palette
const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#818cf8',
    light: '#a5b4fc',
    dark: '#6366f1',
  },
  secondary: {
    main: '#a78bfa',
    light: '#c4b5fd',
    dark: '#7c3aed',
  },
  background: {
    default: '#0f172a',
    paper: '#1e293b',
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
  divider: 'rgba(148, 163, 184, 0.12)',
  success: { main: '#34d399' },
  warning: { main: '#fbbf24' },
  error: { main: '#f87171' },
};

// Shared theme configuration
const getThemeConfig = (mode) => ({
  palette: mode === 'dark' ? darkPalette : lightPalette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '10px 24px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'dark'
            ? '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          borderRadius: 12,
          backgroundColor: mode === 'dark' ? '#1e293b' : '#ffffff',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

// Inner app wrapper that consumes theme context
const ThemedApp = () => {
  const { mode } = useThemeMode();
  const theme = React.useMemo(() => createTheme(getThemeConfig(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ThemedApp />
      </ThemeModeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
