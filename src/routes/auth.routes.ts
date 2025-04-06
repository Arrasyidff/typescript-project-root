import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post('/login', login);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', protect, getMe);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side only for JWT)
 * @access Public
 */
router.post('/logout', logout);

export default router;