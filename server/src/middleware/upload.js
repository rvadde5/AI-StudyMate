import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIMES = {
  '.pdf': ['application/pdf'],
  '.txt': ['text/plain', 'application/octet-stream'],
  '.md': ['text/markdown', 'text/plain', 'application/octet-stream'],
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = Object.keys(ALLOWED_MIMES);

  if (!allowed.includes(ext)) {
    return cb(new Error('Only PDF, TXT, and MD files are allowed'), false);
  }

  const validMimes = ALLOWED_MIMES[ext];
  if (file.mimetype && !validMimes.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Expected ${ext} file.`), false);
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.code === 'LIMIT_FILE_SIZE' ? 'File exceeds 10MB limit.' : err.message,
    });
  }
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});
