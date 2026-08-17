import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
  alpha,
  CircularProgress,
} from '@mui/material';
import { AutoStories } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';
import SEO from '../components/SEO';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateEmail(email)) {
      showError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    try {
      await login(email, password);
      showSuccess('Welcome back! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Sign In" description="Sign in to AI StudyMate — your premium AI-powered learning assistant." path="/login" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              backdropFilter: 'blur(20px)',
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
              border: (theme) => `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            }}
          >
            <Box textAlign="center" mb={3}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 2,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                }}
              >
                <AutoStories />
              </Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Welcome back
              </Typography>
              <Typography color="text.secondary">Sign in to continue your learning journey</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                inputProps={{ 'aria-label': 'Email address' }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                inputProps={{ 'aria-label': 'Password' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                aria-busy={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Typography textAlign="center" variant="body2">
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
                Create account
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Login;
