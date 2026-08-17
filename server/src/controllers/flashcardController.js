import Flashcard from '../models/Flashcard.js';
import Document from '../models/Document.js';
import { asyncHandler } from '../middleware/auth.js';
import { generateStructuredAI, getMockFlashcards } from '../services/aiService.js';

export const getFlashcards = asyncHandler(async (req, res) => {
  const flashcards = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { flashcards } });
});

export const generateFlashcards = asyncHandler(async (req, res) => {
  const { topic, count = 5, documentId } = req.body;
  let content = '';
  let cardTopic = topic || 'Study Topic';

  if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (doc) {
      content = doc.content.slice(0, 6000);
      cardTopic = doc.title;
    }
  }

  const systemPrompt = `Generate ${count} flashcards. Return JSON: {"flashcards":[{"front":"question/term","back":"answer/definition"}]}`;
  const userPrompt = content
    ? `Create flashcards from:\n${content}`
    : `Create flashcards about: ${cardTopic}`;

  let data = await generateStructuredAI(systemPrompt, userPrompt);
  let cards = data?.flashcards;

  if (!cards?.length) {
    cards = getMockFlashcards(cardTopic, Number(count));
  }

  const flashcards = await Flashcard.insertMany(
    cards.map((c) => ({
      user: req.user._id,
      front: c.front,
      back: c.back,
      topic: cardTopic,
      document: documentId || undefined,
    }))
  );

  res.status(201).json({ success: true, message: 'Flashcards generated', data: { flashcards } });
});

export const toggleMastered = asyncHandler(async (req, res) => {
  const flashcard = await Flashcard.findOne({ _id: req.params.id, user: req.user._id });
  if (!flashcard) {
    return res.status(404).json({ success: false, message: 'Flashcard not found.' });
  }

  flashcard.mastered = !flashcard.mastered;
  await flashcard.save();

  res.json({ success: true, data: { flashcard } });
});

export const deleteFlashcard = asyncHandler(async (req, res) => {
  const flashcard = await Flashcard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!flashcard) {
    return res.status(404).json({ success: false, message: 'Flashcard not found.' });
  }
  res.json({ success: true, message: 'Flashcard deleted.' });
});
