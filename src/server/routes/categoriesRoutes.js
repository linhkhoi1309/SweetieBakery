import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/categoriesController.js';

const router = express.Router();    

router.get('/', getAllCategories);
router.post('/', isAuth, isAdmin, createCategory); 
router.delete('/:id', isAuth, isAdmin, deleteCategory); 

export default router;