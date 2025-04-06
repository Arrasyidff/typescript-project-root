import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please provide a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' }),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Update user profile schema
export const updateUserSchema = z.object({
  name: z.string().min(1, { message: 'Name cannot be empty' }).optional(),
  email: z.string().email({ message: 'Please provide a valid email' }).optional(),
});

// Admin update user schema
export const adminUpdateUserSchema = updateUserSchema.extend({
  role: z.enum(['user', 'admin'], { 
    errorMap: () => ({ message: 'Role must be either user or admin' })
  }).optional(),
  isActive: z.boolean({
    errorMap: () => ({ message: 'isActive must be a boolean' })
  }).optional(),
});

// Schema type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;