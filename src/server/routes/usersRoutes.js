import express from 'express';
import { isAuth, isAdmin } from '../middlewares/authMiddleware.js';
import { getUserProfile, updateUserProfile, getAllUsers, deleteUserById } from '../controllers/usersController.js';

const router = express.Router();

router.get('/profile', isAuth, getUserProfile);
router.put('/profile', isAuth, updateUserProfile);
router.get('/', isAuth, isAdmin, getAllUsers);
router.delete('/:id', isAuth, isAdmin, deleteUserById);


export default router;