import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes in this router
router.use(protect);

/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', getUserProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', updateUserProfile);

// Admin routes
/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private/Admin
 */
router.get('/', restrictTo('admin'), getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private/Admin
 */
router.get('/:id', restrictTo('admin'), getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private/Admin
 */
router.put('/:id', restrictTo('admin'), updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private/Admin
 */
router.delete('/:id', restrictTo('admin'), deleteUser);

export default router;