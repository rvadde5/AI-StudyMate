import { Box, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = false, size = 44, message = 'Loading...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight={fullScreen ? '100vh' : 200}
    gap={2}
    role="status"
    aria-live="polite"
    aria-label={message}
  >
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: (theme) => `3px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderTopColor: 'primary.main',
        }}
      />
      <Box
        component={motion.div}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        sx={{
          position: 'absolute',
          inset: '30%',
          borderRadius: '50%',
          bgcolor: 'primary.main',
          opacity: 0.6,
        }}
      />
    </Box>
    <Typography variant="body2" color="text.secondary" fontWeight={500}>
      {message}
    </Typography>
  </Box>
);

export default LoadingSpinner;
