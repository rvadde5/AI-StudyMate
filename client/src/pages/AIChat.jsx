import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Send, Delete, SmartToy, Person } from '@mui/icons-material';
import { chatAPI, documentAPI } from '../api';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { ChatSkeleton } from '../components/SkeletonLoader';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [chatRes, docRes] = await Promise.all([
          chatAPI.getHistory(),
          documentAPI.getAll(),
        ]);
        setMessages(chatRes.data.data.messages);
        setDocuments(docRes.data.data.documents);
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to load chat.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage, _id: tempId },
    ]);

    try {
      const res = await chatAPI.send({
        message: userMessage,
        documentId: selectedDoc || undefined,
      });
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempId),
        { role: 'user', content: userMessage, _id: `user-${Date.now()}` },
        res.data.data.message,
      ]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      showError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      await chatAPI.clear();
      setMessages([]);
      showSuccess('Chat history cleared.');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to clear chat.');
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="AI Chat" path="/chat" />
        <PageHeader title="AI Chat" subtitle="Ask questions about your study materials" />
        <ChatSkeleton />
      </>
    );
  }

  return (
    <Box>
      <SEO title="AI Chat" description="Interactive AI tutor chat with document context support." path="/chat" />
      <PageHeader title="AI Chat" subtitle="Ask questions about your study materials" />
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Reference Document</InputLabel>
            <Select
              value={selectedDoc}
              label="Reference Document"
              onChange={(e) => setSelectedDoc(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {documents.map((doc) => (
                <MenuItem key={doc._id} value={doc._id}>
                  {doc.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleClear} aria-label="Clear chat" color="error" disabled={clearing}>
            <Delete />
          </IconButton>
        </Box>
      </Box>

      <Paper
        sx={{
          height: 'calc(100vh - 280px)',
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 ? (
            <Box textAlign="center" py={8}>
              <SmartToy sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Start a conversation
              </Typography>
              <Typography color="text.secondary">
                Ask me anything about your coursework, exams, or study strategies!
              </Typography>
            </Box>
          ) : (
            messages.map((msg, i) => (
              <Box
                key={msg._id || i}
                display="flex"
                justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                mb={2}
              >
                <Box
                  display="flex"
                  gap={1}
                  maxWidth="80%"
                  flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
                >
                  <Avatar
                    sx={{
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {msg.role === 'user' ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
                  </Avatar>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                      color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))
          )}
          {sending && (
            <Box display="flex" gap={1} mb={2}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <SmartToy fontSize="small" />
              </Avatar>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box component="form" onSubmit={handleSend} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              size="small"
              inputProps={{ maxLength: 4000, 'aria-label': 'Chat message' }}
            />
            <Button type="submit" variant="contained" disabled={!input.trim() || sending} aria-label="Send message">
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIChat;
