import multer, { memoryStorage } from 'multer';

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;
