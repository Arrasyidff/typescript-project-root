import { User, IUserDocument } from '../models/user.model';
import { updateUserSchema, adminUpdateUserSchema, UpdateUserInput, AdminUpdateUserInput } from '../schemas/user.schema';
import { Types } from 'mongoose';
import { AppError } from '../utils/app-error';
import { ZodError } from 'zod';

/**
 * Get all users
 * @returns array of all users
 */
const getAllUsers = async (): Promise<IUserDocument[]> => {
  try {
    return await User.find();
  } catch (error) {
    throw new AppError(`Failed to get users: ${(error as Error).message}`, 500);
  }
};

/**
 * Get user by ID
 * @param id user ID
 * @returns user or null if not found
 */
const getUserById = async (id: string): Promise<IUserDocument> => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError(`User not found with id: ${id}`, 404);
    }
    return user;
  } catch (error) {
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle invalid ObjectId
    if (error instanceof Error && error.name === 'CastError') {
      throw new AppError(`Invalid user ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to get user: ${(error as Error).message}`, 500);
  }
};

/**
 * Get user by email
 * @param email user email
 * @returns user or null if not found
 */
const getUserByEmail = async (email: string): Promise<IUserDocument> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(`User not found with email: ${email}`, 404);
    }
    return user;
  } catch (error) {
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(`Failed to get user by email: ${(error as Error).message}`, 500);
  }
};

/**
 * Update user profile (for regular users)
 * @param id user ID
 * @param userData user data to update
 * @returns updated user
 */
const updateUserProfile = async (
  id: string,
  userData: UpdateUserInput
): Promise<IUserDocument> => {
  try {
    // Validate input data
    const validatedData = updateUserSchema.parse(userData);
    
    // Check if email is being updated and already exists
    if (validatedData.email) {
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new AppError(`Email already in use: ${validatedData.email}`, 400);
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedUser) {
      throw new AppError(`User not found with id: ${id}`, 404);
    }
    
    return updatedUser;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle invalid ObjectId
    if (error instanceof Error && error.name === 'CastError') {
      throw new AppError(`Invalid user ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to update user: ${(error as Error).message}`, 500);
  }
};

/**
 * Update user (for admin users)
 * @param id user ID
 * @param userData user data to update
 * @returns updated user
 */
const updateUser = async (
  id: string,
  userData: AdminUpdateUserInput
): Promise<IUserDocument> => {
  try {
    // Validate input data with admin schema
    const validatedData = adminUpdateUserSchema.parse(userData);
    
    // Check if email is being updated and already exists
    if (validatedData.email) {
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new AppError(`Email already in use: ${validatedData.email}`, 400);
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedUser) {
      throw new AppError(`User not found with id: ${id}`, 404);
    }
    
    return updatedUser;
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle invalid ObjectId
    if (error instanceof Error && error.name === 'CastError') {
      throw new AppError(`Invalid user ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to update user: ${(error as Error).message}`, 500);
  }
};

/**
 * Delete user
 * @param id user ID
 */
const deleteUser = async (id: string): Promise<void> => {
  try {
    const result = await User.findByIdAndDelete(id);
    
    if (!result) {
      throw new AppError(`User not found with id: ${id}`, 404);
    }
  } catch (error) {
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle invalid ObjectId
    if (error instanceof Error && error.name === 'CastError') {
      throw new AppError(`Invalid user ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to delete user: ${(error as Error).message}`, 500);
  }
};

/**
 * Update password
 * @param id user ID
 * @param password new password
 * @returns updated user
 */
const updatePassword = async (
  id: string,
  password: string
): Promise<IUserDocument> => {
  try {
    const user = await User.findById(id).select('+password');

    if (!user) {
      throw new AppError(`User not found with id: ${id}`, 404);
    }

    user.password = password;
    return await user.save();
  } catch (error) {
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // Handle invalid ObjectId
    if (error instanceof Error && error.name === 'CastError') {
      throw new AppError(`Invalid user ID: ${id}`, 400);
    }
    
    throw new AppError(`Failed to update password: ${(error as Error).message}`, 500);
  }
};

export const userService = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserProfile,
  updateUser,
  deleteUser,
  updatePassword,
};