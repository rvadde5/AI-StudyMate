import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { quizValidation, quizSubmitValidation, mongoIdParam } from '../utils/validators.js';
import {
  getQuizzes,
  getQuiz,
  generateQuiz,
  submitQuiz,
  deleteQuiz,
} from '../controllers/quizController.js';

const router = Router();

router.use(protect);

router.get('/', getQuizzes);
router.post('/generate', quizValidation, validate, generateQuiz);
router.get('/:id', ...mongoIdParam('id'), validate, getQuiz);
router.post('/:id/submit', quizSubmitValidation, validate, submitQuiz);
router.delete('/:id', ...mongoIdParam('id'), validate, deleteQuiz);

export default router;
