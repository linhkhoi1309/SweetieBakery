import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { 
    getAllReviewsAdmin, 
    updateReviewStatus, 
    replyToReview 
} from '../controllers/reviewsController.js';

const router = express.Router();

// Lấy tất cả review (cho trang Admin Dashboard)
router.get('/', isAuth, isAdmin, getAllReviewsAdmin);

router.put('/:id/status', isAuth, isAdmin, updateReviewStatus);
router.put('/:id/reply', isAuth, isAdmin, replyToReview);

export default router;