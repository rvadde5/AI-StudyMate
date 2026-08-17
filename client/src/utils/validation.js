export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
};

export const validateName = (name) => {
  if (!name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (name.length > 100) return 'Name must be under 100 characters.';
  return null;
};

export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) return `${fieldName} is required.`;
  return null;
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const validateFile = (file) => {
  if (!file) return 'Please select a file.';
  if (file.size > MAX_FILE_SIZE) return 'File must be under 10MB.';
  const allowed = ['.pdf', '.txt', '.md'];
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowed.includes(ext)) return 'Only PDF, TXT, and MD files are allowed.';
  return null;
};
