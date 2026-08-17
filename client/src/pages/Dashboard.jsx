import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  alpha,
  useTheme,
} from '@mui/material';
import {
  MenuBook,
  Quiz,
  Style,
  Chat,
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';
import { authAPI, documentAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StudyActivityChart from '../components/charts/StudyActivityChart';
import QuizPerformanceChart from '../components/charts/QuizPerformanceChart';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import SEO from '../components/SEO';

const statConfig = [
  { key: 'documents', label: 'Study Materials', icon: <MenuBook />, color: '#6366f1' },
  { key: 'quizzes', label: 'Quizzes Taken', icon: <Quiz />, color: '#8b5cf6' },
  { key: 'flashcards', label: 'Flashcards', icon: <Style />, color: '#06b6d4' },
  { key: 'chatMessages', label: 'AI Sessions', icon: <Chat />, color: '#10b981' },
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, recRes] = await Promise.all([
          authAPI.getDashboard(),
          documentAPI.getRecommendations(),
        ]);
        setData(dashRes.data.data);
        setRecommendations(recRes.data.data.recommendations);
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showError]);

  if (loading) {
    return (
      <>
        <SEO title="Dashboard" description="Your personalized AI study dashboard with analytics and recommendations." path="/dashboard" />
        <DashboardSkeleton />
      </>
    );
  }

  const avgScore =
    data?.recentQuizzes?.filter((q) => q.score !== null).reduce((acc, q, _, arr) => acc + q.score / arr.length, 0) ||
    0;

  return (
    <Box>
      <SEO title="Dashboard" description="Your personalized AI study dashboard with analytics and recommendations." path="/dashboard" />
      <PageHeader
        badge="OVERVIEW"
        title="Dashboard"
        subtitle="Track your learning progress and get AI-powered study insights"
      />

      <Grid container spacing={2.5} mb={3}>
        {statConfig.map(({ key, label, icon, color }, index) => (
          <Grid item xs={12} sm={6} lg={3} key={key}>
            <StatCard
              label={label}
              value={data?.stats?.[key] ?? 0}
              icon={icon}
              color={color}
              delay={index * 0.08}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Study Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Overview of your learning resources
            </Typography>
            <StudyActivityChart stats={data?.stats} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              height: '100%',
              background: `linear-gradient(135deg, ${alpha('#6366f1', 0.08)} 0%, ${alpha('#8b5cf6', 0.04)} 100%)`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <EmojiEvents sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" fontWeight={700}>
                Performance
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight={800} color="primary.main">
              {avgScore ? `${Math.round(avgScore)}%` : '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Average quiz score
            </Typography>
            <QuizPerformanceChart quizzes={data?.recentQuizzes} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <TrendingUp color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Study Recommendations
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, color: 'text.secondary' }}>
              {recommendations}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Recent Quizzes
            </Typography>
            {data?.recentQuizzes?.length ? (
              <List dense disablePadding>
                {data.recentQuizzes.map((quiz) => (
                  <ListItem
                    key={quiz._id}
                    divider
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
                    }}
                  >
                    <ListItemText
                      primary={quiz.title}
                      secondary={new Date(quiz.createdAt).toLocaleDateString()}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    {quiz.score !== null && (
                      <Chip
                        label={`${quiz.score}%`}
                        color={quiz.score >= 70 ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                py={4}
                textAlign="center"
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 2 }}
              >
                <Quiz sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">
                  No quizzes yet. Generate your first quiz!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
