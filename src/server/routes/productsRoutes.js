import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productsController.js';

import { createReview, getProductReviews } from '../controllers/reviewsController.js'; 

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', isAuth, isAdmin, createProduct);
router.put('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);


router.get('/:id/reviews', getProductReviews);

router.post('/:id/reviews', isAuth, createReview);

export default router;