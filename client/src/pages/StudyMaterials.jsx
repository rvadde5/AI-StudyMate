import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import {
  Upload,
  NoteAdd,
  Delete,
  Summarize,
  Style,
  Description,
} from '@mui/icons-material';
import { documentAPI, flashcardAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { CardGridSkeleton } from '../components/SkeletonLoader';

const StudyMaterials = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();
  const [tab, setTab] = useState(0);
  const [noteDialog, setNoteDialog] = useState(false);
  const [summaryDialog, setSummaryDialog] = useState({ open: false, content: '', title: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [uploadForm, setUploadForm] = useState({ title: '', file: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await documentAPI.getAll();
      setDocuments(res.data.data.documents);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateNote = async () => {
    setSubmitting(true);
    try {
      await documentAPI.createNote(noteForm);
      setNoteDialog(false);
      setNoteForm({ title: '', content: '' });
      showSuccess('Note created successfully!');
      fetchDocuments();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create note.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      showError('Please select a file.');
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('title', uploadForm.title || uploadForm.file.name);

    try {
      await documentAPI.upload(formData);
      setUploadForm({ title: '', file: null });
      showSuccess('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSummarize = async (id, title) => {
    setSubmitting(true);
    try {
      const res = await documentAPI.summarize(id);
      setSummaryDialog({ open: true, content: res.data.data.summary, title });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to summarize document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateFlashcards = async (doc) => {
    setSubmitting(true);
    try {
      await flashcardAPI.generate({ documentId: doc._id, count: 5 });
      showSuccess(`Flashcards generated from "${doc.title}"!`);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to generate flashcards.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentAPI.delete(id);
      showSuccess('Document deleted.');
      fetchDocuments();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete document.');
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Study Materials" path="/materials" />
        <PageHeader title="Study Materials" subtitle="Upload PDFs, notes, and manage your study content" />
        <CardGridSkeleton />
      </>
    );
  }

  return (
    <Box>
      <SEO title="Study Materials" description="Upload and manage your lecture notes, PDFs, and study documents." path="/materials" />
      <PageHeader title="Study Materials" subtitle="Upload PDFs, notes, and manage your study content" />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="My Materials" />
        <Tab label="Upload PDF" />
        <Tab label="Create Note" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={3}>
          {documents.length === 0 ? (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No materials yet
                  </Typography>
                  <Typography color="text.secondary">
                    Upload a PDF or create a note to get started
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            documents.map((doc) => (
              <Grid item xs={12} sm={6} md={4} key={doc._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Chip label={doc.fileType.toUpperCase()} size="small" sx={{ mb: 1 }} />
                    <Typography variant="h6" gutterBottom noWrap>
                      {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {doc.content?.slice(0, 100) || 'No preview available'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() => handleSummarize(doc._id, doc.title)}
                      aria-label="Summarize"
                      color="primary"
                      disabled={submitting}
                    >
                      <Summarize />
                    </IconButton>
                    <IconButton
                      onClick={() => handleGenerateFlashcards(doc)}
                      aria-label="Generate flashcards"
                      color="secondary"
                      disabled={submitting}
                    >
                      <Style />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(doc._id)} aria-label="Delete" color="error">
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tab === 1 && (
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload PDF or Text File
            </Typography>
            <TextField
              fullWidth
              label="Title (optional)"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              margin="normal"
            />
            <Button variant="outlined" component="label" startIcon={<Upload />} sx={{ mt: 2 }}>
              Choose File
              <input
                type="file"
                hidden
                accept=".pdf,.txt,.md"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
              />
            </Button>
            {uploadForm.file && (
              <Typography variant="body2" mt={1}>
                Selected: {uploadForm.file.name}
              </Typography>
            )}
            <Box mt={3}>
              <Button variant="contained" onClick={handleUpload} disabled={submitting || !uploadForm.file}>
                {submitting ? 'Uploading...' : 'Upload Document'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create a New Note
            </Typography>
            <TextField
              fullWidth
              label="Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              margin="normal"
              multiline
              rows={8}
              required
            />
            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<NoteAdd />}
                onClick={handleCreateNote}
                disabled={submitting || !noteForm.title || !noteForm.content}
              >
                {submitting ? 'Saving...' : 'Save Note'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={summaryDialog.open} onClose={() => setSummaryDialog({ open: false, content: '', title: '' })} maxWidth="md" fullWidth>
        <DialogTitle>Summary: {summaryDialog.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{summaryDialog.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSummaryDialog({ open: false, content: '', title: '' })}>Close</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default StudyMaterials;
