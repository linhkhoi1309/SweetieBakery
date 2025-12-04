import express from 'express';
import {isAuth, isAdmin} from '../middlewares/authMiddleware.js';
import {createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus} from '../controllers/ordersController.js';

const router = express.Router();    

router.post('/', isAuth, createOrder);
router.get('/myorders', isAuth, getMyOrders);
router.get('/:id', isAuth, getOrderById);
router.get('/', isAuth, isAdmin, getAllOrders); 
router.put('/:id/status', isAuth, isAdmin, updateOrderStatus);

export default router;