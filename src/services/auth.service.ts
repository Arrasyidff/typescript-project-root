import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/user.model';
import { IAuthResponse } from '../types/user.interface';
import { config } from '../config/env';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../schemas/user.schema';

/**
 * Generate JWT token
 * @param id user id
 * @returns JWT token
 */
const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
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
  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
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
  const token = generateToken(user._id.toString());

  return {
    user: user.toJSON(),
    token,
  };
};

export const authService = {
  register,
  login,
  generateToken,
};