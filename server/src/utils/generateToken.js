import jwt from 'jsonwebtoken';
import { getJwtSecret } from './security.js';

/**
 * Generate JWT token for authenticated user.
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Normalize user object for consistent API responses.
 */
export const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  preferences: user.preferences,
  createdAt: user.createdAt,
});
