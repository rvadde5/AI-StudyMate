import Quiz from '../models/Quiz.js';
import Document from '../models/Document.js';
import { asyncHandler } from '../middleware/auth.js';
import { generateStructuredAI, getMockQuiz } from '../services/aiService.js';

export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { quizzes } });
});

export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }
  res.json({ success: true, data: { quiz } });
});

export const generateQuiz = asyncHandler(async (req, res) => {
  const { topic, count = 5, documentId } = req.body;
  let content = '';
  let quizTopic = topic || 'General Study Topics';

  if (documentId) {
    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (doc) {
      content = doc.content.slice(0, 6000);
      quizTopic = doc.title;
    }
  }

  const systemPrompt = `Generate a quiz with exactly ${count} multiple-choice questions. Return JSON with format: {"title":"Quiz Title","questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]}. correctAnswer is 0-indexed.`;
  const userPrompt = content
    ? `Create quiz from this content about ${quizTopic}:\n${content}`
    : `Create a quiz about: ${quizTopic}`;

  let quizData = await generateStructuredAI(systemPrompt, userPrompt);

  if (!quizData?.questions?.length) {
    quizData = getMockQuiz(quizTopic, Number(count));
  }

  const quiz = await Quiz.create({
    user: req.user._id,
    title: quizData.title || `Quiz: ${quizTopic}`,
    topic: quizTopic,
    questions: quizData.questions,
    totalQuestions: quizData.questions.length,
    document: documentId || undefined,
  });

  res.status(201).json({ success: true, message: 'Quiz generated', data: { quiz } });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user._id });

  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }

  if (quiz.score !== null) {
    return res.status(400).json({ success: false, message: 'Quiz has already been submitted.' });
  }

  if (answers.length !== quiz.questions.length) {
    return res.status(400).json({
      success: false,
      message: `Expected ${quiz.questions.length} answers, received ${answers.length}.`,
    });
  }

  let correct = 0;
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) correct++;
    return {
      question: q.question,
      userAnswer: answers[i],
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  quiz.score = Math.round((correct / quiz.questions.length) * 100);
  await quiz.save();

  res.json({
    success: true,
    data: {
      score: quiz.score,
      correct,
      total: quiz.questions.length,
      results,
    },
  });
});

export const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!quiz) {
    return res.status(404).json({ success: false, message: 'Quiz not found.' });
  }
  res.json({ success: true, message: 'Quiz deleted.' });
});
