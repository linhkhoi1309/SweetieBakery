import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', uploadMiddleware.single('image'), uploadImage);
router.delete('/', isAuth, deleteImage);

export default router;