import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';
import { AppError, catchAsync } from '../utils';

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  const user = await userService.getUserById(userId.toString());

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json(user);
});

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new AppError('User not authenticated', 401));
  }

  try {
    const userData = req.body;
    const updatedUser = await userService.updateUserProfile(
      userId.toString(),
      userData
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return next(new AppError(
        `Validation failed: ${JSON.stringify(formattedErrors)}`, 
        400
      ));
    }
    next(error);
  }
});

/**
 * Get all users (Admin only)
 * @route GET /api/users
 * @access Private/Admin
 */
export const getAllUsers = catchAsync(async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});

/**
 * Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
export const getUserById = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json(user);
});

/**
 * Update user (Admin only)
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
export const updateUser = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await userService.updateUser(id, userData);

    if (!updatedUser) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path.join('.')] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      
      return next(new AppError(
        `Validation failed: ${JSON.stringify(formattedErrors)}`, 
        400
      ));
    }
    next(error);
  }
});

/**
 * Delete user (Admin only)
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
export const deleteUser = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  
  try {
    await userService.deleteUser(id);
    
    // Respond with 204 No Content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});