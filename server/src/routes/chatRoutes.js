import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { chatValidation } from '../utils/validators.js';
import { getChatHistory, sendMessage, clearChat } from '../controllers/chatController.js';

const router = Router();

router.use(protect);

router.get('/', getChatHistory);
router.post('/', chatValidation, validate, sendMessage);
router.delete('/', clearChat);

export default router;
