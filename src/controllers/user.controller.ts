import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
      return;
    }

    const user = await userService.getUserById(userId.toString());

    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get user profile error: ${error.message}`);
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'User not authenticated',
      });
      return;
    }

    const userData = req.body;
    const updatedUser = await userService.updateUserProfile(
      userId.toString(),
      userData
    );

    res.status(200).json(updatedUser);
  } catch (error: any) {
    logger.error(`Update user profile error: ${error.message}`);
    
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
    
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Get all users (Admin only)
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (error: any) {
    logger.error(`Get all users error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    logger.error(`Get user by ID error: ${error.message}`);
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update user (Admin only)
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await userService.updateUser(id, userData);

    res.status(200).json(updatedUser);
  } catch (error: any) {
    logger.error(`Update user error: ${error.message}`);
    
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
    
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Delete user (Admin only)
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error: any) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message,
    });
  }
};