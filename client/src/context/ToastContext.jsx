import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const ToastContext = createContext(null);

const SlideTransition = (props) => <Slide {...props} direction="up" />;

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message, severity = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      showSuccess: (msg) => showToast(msg, 'success'),
      showError: (msg) => showToast(msg, 'error'),
      showWarning: (msg) => showToast(msg, 'warning'),
      showInfo: (msg) => showToast(msg, 'info'),
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          elevation={6}
          sx={{ width: '100%', minWidth: 280, borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
