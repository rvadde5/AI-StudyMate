import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { flashcardValidation, mongoIdParam } from '../utils/validators.js';
import {
  getFlashcards,
  generateFlashcards,
  toggleMastered,
  deleteFlashcard,
} from '../controllers/flashcardController.js';

const router = Router();

router.use(protect);

router.get('/', getFlashcards);
router.post('/generate', flashcardValidation, validate, generateFlashcards);
router.patch('/:id/master', ...mongoIdParam('id'), validate, toggleMastered);
router.delete('/:id', ...mongoIdParam('id'), validate, deleteFlashcard);

export default router;
