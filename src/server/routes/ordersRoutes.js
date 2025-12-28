import express from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAdminStats,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/", isAuth, createOrder);
router.get("/myorders", isAuth, getMyOrders);
router.get("/stats", isAuth, isAdmin, getAdminStats);
router.get("/", isAuth, isAdmin, getAllOrders);
router.get("/:id", isAuth, getOrderById);
router.put("/:id/status", isAuth, isAdmin, updateOrderStatus);

// Lấy dữ liệu thống kê cho trang Dashboard của Admin

export default router;
