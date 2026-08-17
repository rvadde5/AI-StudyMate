import { createTheme, alpha } from '@mui/material/styles';

const brand = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export const getTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: brand.primary,
        light: '#818cf8',
        dark: brand.primaryDark,
      },
      secondary: {
        main: brand.secondary,
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      success: { main: brand.success },
      warning: { main: brand.warning },
      error: { main: brand.error },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
      divider: darkMode ? alpha('#fff', 0.08) : alpha('#000', 0.06),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: { fontWeight: 800, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
          },
          '*:focus-visible': {
            outline: `2px solid ${brand.primary}`,
            outlineOffset: 2,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 12,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${brand.primaryDark} 0%, #7c3aed 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${darkMode ? alpha('#fff', 0.06) : alpha('#000', 0.04)}`,
            boxShadow: darkMode
              ? '0 4px 24px rgba(0,0,0,0.25)'
              : '0 4px 24px rgba(15,23,42,0.06)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: `1px solid ${darkMode ? alpha('#fff', 0.06) : alpha('#000', 0.06)}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            marginBottom: 4,
            '&.Mui-selected': {
              background: darkMode
                ? alpha(brand.primary, 0.18)
                : alpha(brand.primary, 0.1),
              '&:hover': {
                background: darkMode
                  ? alpha(brand.primary, 0.24)
                  : alpha(brand.primary, 0.14),
              },
            },
          },
        },
      },
    },
  });

export { brand };
