import express from "express";
import {
  login,
  register,
  verifyEmail,
  getMe,
} from "../controllers/authController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", isAuth, getMe);
router.post("/login", login);
router.post("/register", register);
router.post("/verify-email", verifyEmail);

export default router;
