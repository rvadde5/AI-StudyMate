import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as DarkModeProvider, useThemeMode } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { getTheme } from './theme/theme';
import App from './App';

const ThemedApp = () => {
  const { darkMode } = useThemeMode();
  return (
    <ThemeProvider theme={getTheme(darkMode)}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <DarkModeProvider>
          <ThemedApp />
        </DarkModeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
