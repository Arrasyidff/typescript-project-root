import { User, IUserDocument } from '../models/user.model';
import { IAuthResponse, IUserResponse } from '../types/user.interface';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../schemas/user.schema';
import { Types } from 'mongoose';
import { generateToken } from '../utils/jwt.utils';

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
  // Validate input data with Zod
  const validatedData = registerSchema.parse(userData);
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create(validatedData);

  // Generate token
  const token = generateToken({ id: (user._id as Types.ObjectId).toString() });

  return {
    user: formatUserResponse(user),
    token,
  };
};

/**
 * Login a user
 * @param loginData user login data
 * @returns auth response with user and token
 */
const login = async (loginData: LoginInput): Promise<IAuthResponse> => {
  // Validate input data with Zod
  const validatedData = loginSchema.parse(loginData);
  const { email, password } = validatedData;

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken({ id: (user._id as Types.ObjectId).toString() });

  return {
    user: formatUserResponse(user),
    token,
  };
};

export const authService = {
  register,
  login,
  formatUserResponse
};