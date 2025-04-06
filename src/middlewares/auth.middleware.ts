import { Request, Response, NextFunction } from 'express';
import { User, IUserDocument } from '../models/user.model';
import { logger } from '../utils/logger';
import { verifyToken } from '../utils/jwt.utils';

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to protect routes
 * Verifies the JWT token and attaches the user to the request object
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    // Check if token exists in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header (format: "Bearer token")
      token = req.headers.authorization.split(' ')[1];
    }

    // If token doesn't exist, return error
    if (!token) {
      res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access',
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token) as DecodedToken;

    // Find user by id (from token)
    const currentUser = await User.findById(decoded.id);

    // Check if user still exists
    if (!currentUser) {
      res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists',
      });
      return;
    }

    // Check if user is active
    if (!currentUser.isActive) {
      res.status(401).json({
        status: 'fail',
        message: 'This user account has been deactivated',
      });
      return;
    }

    // Grant access to protected route by attaching user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    res.status(401).json({
      status: 'fail',
      message: 'Not authorized to access this route',
    });
  }
};

/**
 * Middleware to restrict access to certain roles
 * Must be used after the protect middleware
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Check if user has required role
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
      return;
    }

    next();
  };
};