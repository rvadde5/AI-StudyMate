import fs from 'fs';
import pdfParse from 'pdf-parse';
import Document from '../models/Document.js';
import { sanitizeText } from '../utils/security.js';
import { asyncHandler } from '../middleware/auth.js';
import { generateAIResponse, getMockSummary } from '../services/aiService.js';

export const getDocuments = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { documents } });
});

export const getDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found.' });
  }
  res.json({ success: true, data: { document } });
});

export const createNote = asyncHandler(async (req, res) => {
  const title = sanitizeText(req.body.title, 200);
  const content = sanitizeText(req.body.content || '', 50000);

  const document = await Document.create({
    user: req.user._id,
    title,
    content,
    fileName: `${title}.txt`,
    fileType: 'note',
    fileSize: (content || '').length,
  });

  res.status(201).json({ success: true, message: 'Note created', data: { document } });
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const { title } = req.body;
  const ext = req.file.originalname.split('.').pop()?.toLowerCase();
  let content = '';

  if (ext === 'pdf') {
    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);
    content = pdfData.text;
  } else {
    content = fs.readFileSync(req.file.path, 'utf-8');
  }

  const document = await Document.create({
    user: req.user._id,
    title: sanitizeText(title || req.file.originalname, 200),
    fileName: req.file.originalname,
    storedPath: req.file.path,
    fileType: ext === 'pdf' ? 'pdf' : 'txt',
    content,
    fileSize: req.file.size,
  });

  res.status(201).json({ success: true, message: 'Document uploaded', data: { document } });
});

export const summarizeDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found.' });
  }

  const systemPrompt =
    'You are an expert academic tutor. Summarize the following study material clearly with bullet points covering key concepts, definitions, and important details.';
  const userPrompt = `Document title: ${document.title}\n\nContent:\n${document.content.slice(0, 8000)}`;

  const summary = await generateAIResponse(systemPrompt, userPrompt);
  document.summary = summary || getMockSummary(document.title);
  await document.save();

  res.json({ success: true, data: { summary: document.summary, document } });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!document) {
    return res.status(404).json({ success: false, message: 'Document not found.' });
  }

  if (document.storedPath) {
    try {
      if (fs.existsSync(document.storedPath)) fs.unlinkSync(document.storedPath);
    } catch {
      /* ignore cleanup errors */
    }
  }

  await Document.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Document deleted.' });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const documents = await Document.find({ user: req.user._id }).limit(5);
  const context = documents.map((d) => `- ${d.title}: ${d.content.slice(0, 200)}`).join('\n');

  const systemPrompt =
    'You are a personalized study coach. Based on the student materials, provide 5 actionable study recommendations.';
  const userPrompt = context || 'The student has no uploaded materials yet. Provide general study tips for college students.';

  const recommendations = await generateAIResponse(systemPrompt, userPrompt);

  res.json({ success: true, data: { recommendations } });
});
