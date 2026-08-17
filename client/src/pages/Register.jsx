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
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import SEO from '../components/SEO';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      showError('Password must be at least 8 characters.');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    const nameError = validateName(name);
    if (nameError) {
      showError(nameError);
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      showSuccess('Account created! Welcome to AI StudyMate.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Create Account" description="Join AI StudyMate — the premium AI learning platform for college students." path="/register" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
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
                Create account
              </Typography>
              <Typography color="text.secondary">Start your AI-powered learning journey</Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField fullWidth label="Full name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" required />
              <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
              <TextField fullWidth label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" required />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3, mb: 2, py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>

            <Typography textAlign="center" variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Register;
