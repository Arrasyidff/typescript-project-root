import { User, IUserDocument } from '../models/user.model';
import { IAuthResponse, IUserResponse } from '../types/user.interface';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../schemas/user.schema';
import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt.utils';
import { AppError } from '../utils/app-error';
import { ZodError } from 'zod';

/**
 * Convert Mongoose document to user response object
 * @param user Mongoose user document
 * @returns User response object
 */
const formatUserResponse = (user: IUserDocument): IUserResponse => {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date()
  };
};

/**
 * Register a new user
 * @param userData user registration data
 * @returns auth response with user and token
 */
const register = async (userData: RegisterInput): Promise<IAuthResponse> => {
  try {
    // Validate input data with Zod
    const validatedData = registerSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create new user
    const user = await User.create(validatedData);

    // Generate token
    const token = generateToken({ id: (user._id as Types.ObjectId).toString() });

    return {
      user: formatUserResponse(user),
      token,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // For unknown errors, wrap in an AppError with 500 status
    throw new AppError(`Registration failed: ${(error as Error).message}`, 500);
  }
};

/**
 * Login a user
 * @param loginData user login data
 * @returns auth response with user and token
 */
const login = async (loginData: LoginInput): Promise<IAuthResponse> => {
  try {
    // Validate input data with Zod
    const validatedData = loginSchema.parse(loginData);
    const { email, password } = validatedData;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({ id: (user._id as Types.ObjectId).toString() });

    return {
      user: formatUserResponse(user),
      token,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new AppError(`Validation error: ${formattedErrors}`, 400);
    }
    
    // Re-throw AppError as is
    if (error instanceof AppError) {
      throw error;
    }
    
    // For unknown errors, wrap in an AppError with 500 status
    throw new AppError(`Login failed: ${(error as Error).message}`, 500);
  }
};

export const authService = {
  register,
  login,
  formatUserResponse
};