import multer, { memoryStorage } from 'multer';

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1_024 * 1_024 },
});

export default upload;
