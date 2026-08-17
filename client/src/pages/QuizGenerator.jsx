import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  TextField,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { PlayArrow, Delete, Refresh, CheckCircle, Cancel } from '@mui/icons-material';
import { quizAPI, documentAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { ListSkeleton } from '../components/SkeletonLoader';

const QuizGenerator = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ topic: '', count: 5, documentId: '' });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingQuizId, setLoadingQuizId] = useState(null);

  const fetchData = async () => {
    try {
      const [quizRes, docRes] = await Promise.all([quizAPI.getAll(), documentAPI.getAll()]);
      setQuizzes(quizRes.data.data.quizzes);
      setDocuments(docRes.data.data.documents);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerate = async () => {
    if (!form.topic && !form.documentId) {
      showError('Enter a topic or select a document.');
      return;
    }
    setGenerating(true);
    try {
      const res = await quizAPI.generate(form);
      setActiveQuiz(res.data.data.quiz);
      setAnswers(new Array(res.data.data.quiz.questions.length).fill(null));
      setResults(null);
      showSuccess('Quiz generated! Answer the questions below.');
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to generate quiz.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      showError('Please answer all questions.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await quizAPI.submit(activeQuiz._id, answers);
      setResults(res.data.data);
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await quizAPI.delete(id);
      if (activeQuiz?._id === id) {
        setActiveQuiz(null);
        setResults(null);
      }
      fetchData();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete quiz.');
    }
  };

  const loadQuiz = async (id) => {
    setLoadingQuizId(id);
    try {
      const res = await quizAPI.getOne(id);
      const quiz = res.data.data.quiz;
      setActiveQuiz(quiz);
      if (quiz.score !== null) {
        setResults({ score: quiz.score, correct: null, total: quiz.totalQuestions, alreadySubmitted: true });
        setAnswers([]);
      } else {
        setAnswers(new Array(quiz.questions.length).fill(null));
        setResults(null);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load quiz.');
    } finally {
      setLoadingQuizId(null);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Quiz Generator" path="/quiz" />
        <PageHeader title="Quiz Generator" subtitle="Generate AI-powered quizzes from your study materials" />
        <ListSkeleton rows={6} />
      </>
    );
  }

  return (
    <Box>
      <SEO title="Quiz Generator" description="Create AI-powered practice quizzes from your notes and documents." path="/quiz" />
      <PageHeader title="Quiz Generator" subtitle="Generate AI-powered quizzes from your study materials" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generate New Quiz
            </Typography>
            <TextField
              fullWidth
              label="Topic"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              margin="normal"
              placeholder="e.g. Organic Chemistry"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>From Document</InputLabel>
              <Select
                value={form.documentId}
                label="From Document"
                onChange={(e) => setForm({ ...form, documentId: e.target.value })}
              >
                <MenuItem value="">None</MenuItem>
                {documents.map((doc) => (
                  <MenuItem key={doc._id} value={doc._id}>
                    {doc.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Number of Questions"
              type="number"
              value={form.count}
              onChange={(e) => setForm({ ...form, count: Math.min(20, Math.max(1, Number(e.target.value))) })}
              margin="normal"
              inputProps={{ min: 1, max: 20 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleGenerate}
              disabled={generating}
              sx={{ mt: 2 }}
            >
              {generating ? 'Generating...' : 'Generate Quiz'}
            </Button>

            <Typography variant="h6" mt={4} mb={2}>
              Previous Quizzes
            </Typography>
            <List dense>
              {quizzes.map((quiz) => (
                <ListItem
                  key={quiz._id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(quiz._id)} aria-label="Delete quiz">
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={quiz.title}
                    secondary={quiz.score !== null ? `Score: ${quiz.score}%` : 'Not taken'}
                    onClick={() => loadQuiz(quiz._id)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {generating && <LinearProgress sx={{ mb: 2 }} />}

          {activeQuiz ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {activeQuiz.title}
              </Typography>

              {results && (
                <Box mb={3}>
                  <Chip
                    icon={results.score >= 70 ? <CheckCircle /> : <Cancel />}
                    label={`Score: ${results.score}% (${results.correct}/${results.total})`}
                    color={results.score >= 70 ? 'success' : 'error'}
                    sx={{ fontSize: '1rem', py: 2, px: 1 }}
                  />
                </Box>
              )}

              {activeQuiz.questions.map((q, qi) => (
                <Card key={qi} sx={{ mb: 2, bgcolor: results ? (results.results[qi].isCorrect ? 'success.50' : 'error.50') : 'background.paper' }}>
                  <CardContent>
                    <Typography fontWeight={600} gutterBottom>
                      {qi + 1}. {q.question}
                    </Typography>
                    <RadioGroup
                      value={answers[qi]?.toString() ?? ''}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[qi] = Number(e.target.value);
                        setAnswers(newAnswers);
                      }}
                    >
                      {q.options.map((opt, oi) => (
                        <FormControlLabel
                          key={oi}
                          value={oi.toString()}
                          control={<Radio />}
                          label={opt}
                          disabled={!!results}
                        />
                      ))}
                    </RadioGroup>
                    {results && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {results.results[qi].explanation}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              ))}

              {results?.alreadySubmitted && (
                <Typography color="text.secondary" mb={2}>
                  This quiz was already completed. Score: {results.score}%
                </Typography>
              )}

              {!results?.alreadySubmitted && !results && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
              )}
            </Paper>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                Generate a quiz or select one from the list
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

    </Box>
  );
};

export default QuizGenerator;
