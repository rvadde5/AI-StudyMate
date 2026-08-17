import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Typography,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Flip, Delete, CheckCircle, Style } from '@mui/icons-material';
import { flashcardAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { showError, showSuccess } = useToast();
  const theme = useTheme();

  const fetchFlashcards = async () => {
    try {
      const res = await flashcardAPI.getAll();
      setFlashcards(res.data.data.flashcards);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load flashcards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const handleToggleMastered = async (id) => {
    try {
      const res = await flashcardAPI.toggleMastered(id);
      setFlashcards((prev) =>
        prev.map((c) => (c._id === id ? res.data.data.flashcard : c))
      );
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update flashcard.');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete);
    try {
      await flashcardAPI.delete(confirmDelete);
      setFlashcards((prev) => prev.filter((c) => c._id !== confirmDelete));
      showSuccess('Flashcard deleted.');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete flashcard.');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Flashcards" path="/flashcards" />
        <PageHeader title="Flashcards" subtitle="Review and master your study cards" />
        <CardGridSkeleton count={6} />
      </>
    );
  }

  return (
    <Box>
      <SEO title="Flashcards" description="Study flashcards generated from your materials." path="/flashcards" />
      <PageHeader
        title="Flashcards"
        subtitle="Review and master your study cards"
        action={
          <Chip
            label={`${flashcards.filter((c) => c.mastered).length}/${flashcards.length} mastered`}
            color="primary"
            variant="outlined"
          />
        }
      />

      {flashcards.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, borderRadius: 3 }}>
          <CardContent>
            <Style sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No flashcards yet
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Generate flashcards from Study Materials to start reviewing.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {flashcards.map((card) => {
            const isFlipped = flipped[card._id];
            return (
              <Grid item xs={12} sm={6} md={4} key={card._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: card.mastered
                      ? `2px solid ${theme.palette.success.main}`
                      : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    minHeight: 200,
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                  onClick={() => setFlipped((prev) => ({ ...prev, [card._id]: !prev[card._id] }))}
                  role="button"
                  tabIndex={0}
                  aria-label={`Flashcard: ${isFlipped ? card.back : card.front}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFlipped((prev) => ({ ...prev, [card._id]: !prev[card._id] }));
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Chip label={card.topic || 'General'} size="small" />
                      <Box onClick={(e) => e.stopPropagation()}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleMastered(card._id)}
                          aria-label={card.mastered ? 'Mark as not mastered' : 'Mark as mastered'}
                          color={card.mastered ? 'success' : 'default'}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => setConfirmDelete(card._id)}
                          aria-label="Delete flashcard"
                          color="error"
                          disabled={deletingId === card._id}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="overline" color="text.secondary">
                      {isFlipped ? 'Answer' : 'Question'}
                    </Typography>
                    <Typography variant="body1" fontWeight={600} sx={{ minHeight: 80 }}>
                      {isFlipped ? card.back : card.front}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                      <Flip fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Click to flip
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">Delete flashcard?</DialogTitle>
        <DialogContent>This action cannot be undone.</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!!deletingId}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Flashcards;
