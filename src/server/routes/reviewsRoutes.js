import express from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getAllReviewsAdmin,
  updateReviewStatus,
  replyToReview,
  getProductReviews,
  createReview,
} from "../controllers/reviewsController.js";

const router = express.Router();

// Lấy review của sản phẩm (Public - Không cần check login)
router.get("/product/:productId", getProductReviews);

// Gửi review mới (Cần đăng nhập - isAuth)
router.post("/product/:productId", isAuth, createReview);

// Lấy tất cả review (cho trang Admin Dashboard)
router.get("/", isAuth, isAdmin, getAllReviewsAdmin);

router.put("/:id/status", isAuth, isAdmin, updateReviewStatus);
router.put("/:id/reply", isAuth, isAdmin, replyToReview);

export default router;
