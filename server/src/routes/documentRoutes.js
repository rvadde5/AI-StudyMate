import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload, uploadErrorHandler } from '../middleware/upload.js';
import { documentValidation, mongoIdParam } from '../utils/validators.js';
import {
  getDocuments,
  getDocument,
  createNote,
  uploadDocument,
  summarizeDocument,
  deleteDocument,
  getRecommendations,
} from '../controllers/documentController.js';

const router = Router();

router.use(protect);

router.get('/', getDocuments);
router.get('/recommendations', getRecommendations);
router.get('/:id', ...mongoIdParam('id'), validate, getDocument);
router.post('/note', documentValidation, validate, createNote);
router.post('/upload', upload.single('file'), uploadErrorHandler, uploadDocument);
router.post('/:id/summarize', ...mongoIdParam('id'), validate, summarizeDocument);
router.delete('/:id', ...mongoIdParam('id'), validate, deleteDocument);

export default router;
