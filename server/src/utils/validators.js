import { body, param } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const chatValidation = [
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 4000 }),
  body('sessionId').optional().trim().isLength({ max: 100 }),
  body('documentId').optional().isMongoId().withMessage('Invalid document ID'),
];

export const quizValidation = [
  body('topic').optional().trim().isLength({ max: 200 }),
  body('count').optional().isInt({ min: 1, max: 20 }).toInt(),
  body('documentId').optional().isMongoId().withMessage('Invalid document ID'),
];

export const quizSubmitValidation = [
  param('id').isMongoId().withMessage('Invalid quiz ID'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array'),
  body('answers.*').isInt({ min: 0, max: 3 }).withMessage('Each answer must be 0-3'),
];

export const documentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').optional().trim().isLength({ max: 50000 }),
];

export const profileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('preferences.studyGoals').optional().trim().isLength({ max: 1000 }),
  body('preferences.darkMode').optional().isBoolean(),
];

export const flashcardValidation = [
  body('topic').optional().trim().isLength({ max: 200 }),
  body('count').optional().isInt({ min: 1, max: 30 }).toInt(),
  body('documentId').optional().isMongoId().withMessage('Invalid document ID'),
];

export const mongoIdParam = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
];

export const roleValidation = [
  body('role').isIn(['student', 'admin']).withMessage('Role must be student or admin'),
];
