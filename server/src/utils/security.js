/**
 * Returns JWT secret — fails fast in production if not configured.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'your_super_secret_jwt_key_change_in_production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'dev_secret_local_only';
  }
  return secret;
};

/**
 * Strip HTML tags from user-provided strings to reduce XSS risk in stored content.
 */
export const sanitizeText = (input, maxLength = 10000) => {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
};
