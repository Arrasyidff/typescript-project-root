import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError, catchAsync } from '../utils';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = catchAsync(async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const userData = req.body;
    const result = await authService.register(userData);

    res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Register error: ${error.message}`);
    
    if (error instanceof ZodError) {
      return next(new AppError(
        'Validation failed', 
        400
      ));
    }
    
    next(error);
  }
});

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = catchAsync(async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const loginData = req.body;
    const result = await authService.login(loginData);

    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    
    if (error instanceof ZodError) {
      return next(new AppError(
        'Validation failed', 
        400
      ));
    }
    
    if (error.message === 'Invalid email or password') {
      return next(new AppError(
        'Invalid email or password',
        401
      ));
    }
    
    next(error);
  }
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = catchAsync(async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json(user);
});

/**
 * Logout a user (client-side only for JWT)
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = (req: Request, res: Response): void => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};