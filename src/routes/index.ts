import { Router } from 'express';
import authRoutes from '../api/auth/auth.routes';
import userRoutes from '../api/users/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;