import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const result = await authService.register(userData);

    res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Register error: ${error.message}`);
    
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path.join('.')] = curr.message;
          return acc;
        }, {} as Record<string, string>),
      });
      return;
    }
    
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = req.body;
    const result = await authService.login(loginData);

    res.status(200).json(result);
  } catch (error: any) {
    logger.error(`Login error: ${error.message}`);
    
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: error.errors.reduce((acc, curr) => {
          acc[curr.path.join('.')] = curr.message;
          return acc;
        }, {} as Record<string, string>),
      });
      return;
    }
    
    res.status(401).json({
      status: 'fail',
      message: error.message,
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get me error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

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