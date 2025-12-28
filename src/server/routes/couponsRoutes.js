import express from "express";
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  applyCoupon,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getPublicCoupons,
} from "../controllers/couponsController.js";

const router = express.Router();

// user routes
router.get("/public", getPublicCoupons);
router.post("/apply", isAuth, applyCoupon);
// admin routes
router.get("/", isAuth, isAdmin, getAllCoupons);
router.post("/", isAuth, isAdmin, createCoupon);
router.put("/:id", isAuth, isAdmin, updateCoupon);
router.delete("/:id", isAuth, isAdmin, deleteCoupon);

export default router;
