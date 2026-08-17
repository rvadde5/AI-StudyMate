import { Box, Button, Container, Typography, Paper, alpha } from '@mui/material';
import { Home, ArrowBack, SearchOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import PageTransition from '../components/PageTransition';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <PageTransition>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        path="/404"
      />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          backgroundImage: (theme) =>
            theme.palette.mode === 'dark'
              ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.15) 0%, transparent 60%)'
              : 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, transparent 60%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            component={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <SearchOff sx={{ fontSize: 44, color: 'primary.main' }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '4rem', md: '5rem' },
                fontWeight: 900,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                mb: 1,
              }}
            >
              404
            </Typography>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Page not found
            </Typography>
            <Typography color="text.secondary" mb={4}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
              <Button
                variant="contained"
                component={RouterLink}
                to={user ? '/dashboard' : '/login'}
                startIcon={<Home />}
              >
                {user ? 'Dashboard' : 'Sign In'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </PageTransition>
  );
};

export default NotFound;
