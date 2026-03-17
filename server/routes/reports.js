import express from 'express';
import multer from 'multer';
import { verifyImage } from '../services/imageverifier.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const verification = await verifyImage(req.file.buffer);
    res.json({ success: true, verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;