import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
  Avatar,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { Person, Save } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { authAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, setDarkMode } = useThemeMode();
  const [name, setName] = useState(user?.name || '');
  const [studyGoals, setStudyGoals] = useState(user?.preferences?.studyGoals || '');
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await authAPI.updateProfile({
        name,
        preferences: { darkMode, studyGoals },
      });
      updateUser(res.data.data.user);
      setDarkMode(darkMode);
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <SEO title="Profile" description="Manage your AI StudyMate account settings and preferences." path="/profile" />
      <PageHeader title="Profile" subtitle="Manage your account settings and preferences" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6">{user?.name}</Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
              <Typography variant="caption" color="primary" display="block" mt={1}>
                {user?.role === 'admin' ? 'Administrator' : 'Student'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Edit Profile
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Study Goals"
                value={studyGoals}
                onChange={(e) => setStudyGoals(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                placeholder="What are you studying for? e.g. Final exams in Biology and Chemistry"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                }
                label="Dark Mode"
                sx={{ mt: 2, display: 'block' }}
              />

              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{ mt: 3 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default Profile;
