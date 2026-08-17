import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AutoStories,
  Chat,
  Quiz,
  Summarize,
  Style,
  Security,
  Devices,
  Speed,
  AccessibilityNew,
} from '@mui/icons-material';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';

const features = [
  { icon: <Chat />, title: 'AI Chat', desc: 'Ask questions and get instant help from your AI tutor.', color: '#6366f1' },
  { icon: <Summarize />, title: 'Document Summarizer', desc: 'Upload PDFs and get concise AI-powered summaries.', color: '#8b5cf6' },
  { icon: <Quiz />, title: 'Quiz Generator', desc: 'Generate practice quizzes from your study materials.', color: '#06b6d4' },
  { icon: <Style />, title: 'Flashcards', desc: 'Auto-generate flashcards for effective memorization.', color: '#10b981' },
  { icon: <Security />, title: 'Secure Auth', desc: 'JWT-based authentication keeps your data safe.', color: '#f59e0b' },
  { icon: <Devices />, title: 'Responsive UI', desc: 'Works seamlessly on desktop, tablet, and mobile.', color: '#ef4444' },
  { icon: <Speed />, title: 'Real-time Analytics', desc: 'Track study activity with interactive charts.', color: '#6366f1' },
  { icon: <AccessibilityNew />, title: 'Accessible Design', desc: 'WCAG-friendly with keyboard navigation and ARIA labels.', color: '#8b5cf6' },
];

const About = () => (
  <Box>
    <SEO title="About" description="Learn about AI StudyMate — the premium AI learning platform for college students." path="/about" />
    <PageHeader title="About AI StudyMate" subtitle="The premium AI-powered learning platform built for modern students" />

    <Grid container spacing={3} mb={4}>
      {features.map((f) => (
        <Grid item xs={12} sm={6} md={4} key={f.title}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${f.color}15`,
                  color: f.color,
                  mb: 1.5,
                }}
              >
                {f.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {f.desc}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>

    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Technology Stack
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Frontend" secondary="React 19, Vite, Material UI, React Router, Axios" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Backend" secondary="Node.js, Express.js, MongoDB, JWT Authentication" />
          </ListItem>
          <ListItem>
            <ListItemText primary="AI" secondary="OpenAI API for chat, summarization, and quiz generation" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Deployment" secondary="AWS App Runner (backend), Vercel (frontend)" />
          </ListItem>
        </List>
      </CardContent>
    </Card>

    <Typography textAlign="center" color="text.secondary" mt={4} variant="body2">
      © 2026 AI StudyMate. Built for students, by engineers.
    </Typography>
  </Box>
);

export default About;
