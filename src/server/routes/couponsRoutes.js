import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { applyCoupon, createCoupon } from '../controllers/couponsController.js';

const router = express.Router();

router.post('/apply', isAuth, applyCoupon);
router.post('/', isAuth, isAdmin, createCoupon);

export default router;