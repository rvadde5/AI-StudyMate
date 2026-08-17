import ChatMessage from '../models/ChatMessage.js';
import Document from '../models/Document.js';
import { sanitizeText } from '../utils/security.js';
import { asyncHandler } from '../middleware/auth.js';
import { generateAIResponse } from '../services/aiService.js';

export const getChatHistory = asyncHandler(async (req, res) => {
  const sessionId = req.query.sessionId || 'default';
  const messages = await ChatMessage.find({ user: req.user._id, sessionId })
    .sort({ createdAt: 1 })
    .limit(100);

  res.json({ success: true, data: { messages } });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = sanitizeText(req.body.message, 4000);
  const sessionId = sanitizeText(req.body.sessionId || 'default', 100);
  const { documentId } = req.body;

  await ChatMessage.create({
    user: req.user._id,
    role: 'user',
    content: message,
    sessionId,
  });

  let context = '';
  if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (doc) {
      context = `\n\nReference document "${doc.title}":\n${doc.content.slice(0, 4000)}`;
    }
  }

  const systemPrompt =
    'You are AI StudyMate, a friendly and knowledgeable academic tutor for college students. Help with explanations, study strategies, and answering questions about course material. Be concise but thorough.';
  const aiResponse = await generateAIResponse(systemPrompt, message + context);

  const assistantMessage = await ChatMessage.create({
    user: req.user._id,
    role: 'assistant',
    content: aiResponse,
    sessionId,
  });

  res.json({
    success: true,
    data: {
      message: assistantMessage,
    },
  });
});

export const clearChat = asyncHandler(async (req, res) => {
  const sessionId = req.query.sessionId || 'default';
  await ChatMessage.deleteMany({ user: req.user._id, sessionId });
  res.json({ success: true, message: 'Chat history cleared.' });
});
