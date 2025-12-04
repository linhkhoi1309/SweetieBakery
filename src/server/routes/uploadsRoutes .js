import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// Endpoint: POST /upload
router.post('/', isAuth, upload.single('image'), uploadImage);

export default router;