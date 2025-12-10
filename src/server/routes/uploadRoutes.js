import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js'; 

const router = express.Router();

router.post('/', uploadMiddleware.single('image'), uploadImage);

export default router;