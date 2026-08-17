import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  registerValidation,
  loginValidation,
  profileValidation,
  roleValidation,
  mongoIdParam,
} from '../utils/validators.js';
import {
  register,
  login,
  getProfile,
  updateProfile,
  getDashboard,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileValidation, validate, updateProfile);
router.get('/dashboard', protect, getDashboard);

router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, ...mongoIdParam('id'), validate, deleteUser);
router.put('/users/:id/role', protect, adminOnly, ...mongoIdParam('id'), roleValidation, validate, updateUserRole);

export default router;
