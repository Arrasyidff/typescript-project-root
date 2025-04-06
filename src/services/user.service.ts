import { User, IUserDocument } from '../models/user.model';
import { updateUserSchema, adminUpdateUserSchema, UpdateUserInput, AdminUpdateUserInput } from '../schemas/user.schema';

/**
 * Get all users
 * @returns array of all users
 */
const getAllUsers = async (): Promise<IUserDocument[]> => {
  return User.find();
};

/**
 * Get user by ID
 * @param id user ID
 * @returns user or null if not found
 */
const getUserById = async (id: string): Promise<IUserDocument | null> => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param email user email
 * @returns user or null if not found
 */
const getUserByEmail = async (email: string): Promise<IUserDocument | null> => {
  return User.findOne({ email });
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
): Promise<IUserDocument | null> => {
  // Validate input data
  const validatedData = updateUserSchema.parse(userData);
  
  return User.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });
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
): Promise<IUserDocument | null> => {
  // Validate input data with admin schema
  const validatedData = adminUpdateUserSchema.parse(userData);
  
  return User.findByIdAndUpdate(id, validatedData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete user
 * @param id user ID
 */
const deleteUser = async (id: string): Promise<void> => {
  await User.findByIdAndDelete(id);
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
): Promise<IUserDocument | null> => {
  const user = await User.findById(id).select('+password');

  if (!user) {
    return null;
  }

  user.password = password;
  return user.save();
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