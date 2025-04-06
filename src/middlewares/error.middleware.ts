import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

// Handle JWT error
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again', 401);
};

// Handle JWT expired error
const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please log in again', 401);
};

// Handle CastError (invalid MongoDB ObjectId)
const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle duplicate field value error (MongoDB)
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

// Handle validation error (MongoDB)
const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle Zod validation error
const handleZodError = (err: ZodError): AppError => {
  const formattedErrors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
  return new AppError(`Validation error: ${formattedErrors}`, 400);
};

// Send error response in development environment
const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Send error response in production environment
const sendErrorProd = (err: AppError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

// Global error handling middleware
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else if (config.nodeEnv === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Handle specific error types
    if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
    if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
    if (err instanceof ZodError) error = handleZodError(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};