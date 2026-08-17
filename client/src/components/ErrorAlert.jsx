import { Alert, Snackbar } from '@mui/material';

const ErrorAlert = ({ open, message, severity = 'error', onClose }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default ErrorAlert;
