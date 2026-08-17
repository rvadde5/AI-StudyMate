import User from '../models/User.js';
import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';
import ChatMessage from '../models/ChatMessage.js';
import Flashcard from '../models/Flashcard.js';
import { generateToken, formatUser } from '../utils/generateToken.js';
import { sanitizeText } from '../utils/security.js';
import { asyncHandler } from '../middleware/auth.js';

export const register = asyncHandler(async (req, res) => {
  const name = sanitizeText(req.body.name, 100);
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Email already registered.' });
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: formatUser(user), token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: { user: formatUser(user), token },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: formatUser(req.user) },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, preferences } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = sanitizeText(name, 100);
  if (preferences) {
    if (preferences.studyGoals !== undefined) {
      user.preferences.studyGoals = sanitizeText(preferences.studyGoals, 1000);
    }
    if (typeof preferences.darkMode === 'boolean') {
      user.preferences.darkMode = preferences.darkMode;
    }
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated',
    data: { user: formatUser(user) },
  });
});

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [documents, quizzes, flashcards, chatMessages, recentChats] = await Promise.all([
    Document.countDocuments({ user: userId }),
    Quiz.countDocuments({ user: userId }),
    Flashcard.countDocuments({ user: userId }),
    ChatMessage.countDocuments({ user: userId }),
    ChatMessage.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const recentQuizzes = await Quiz.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title score totalQuestions createdAt');

  res.json({
    success: true,
    data: {
      stats: { documents, quizzes, flashcards, chatMessages },
      recentQuizzes,
      recentChats,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({
    success: true,
    data: {
      users: users.map(formatUser),
      total: users.length,
    },
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted successfully.' });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot change your own role.' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, message: 'Role updated', data: { user: formatUser(user) } });
});
