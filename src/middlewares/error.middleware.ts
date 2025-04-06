import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from '../config/env';
import { ZodError } from 'zod';

interface IAppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  path?: string;
  value?: any;
  errors?: Record<string, any>;
  keyValue?: Record<string, any>;
}

// Handle JWT error
const handleJWTError = (): IAppError => {
  const error: IAppError = new Error('Invalid token. Please log in again');
  error.statusCode = 401;
  return error;
};

// Handle JWT expired error
const handleJWTExpiredError = (): IAppError => {
  const error: IAppError = new Error('Your token has expired. Please log in again');
  error.statusCode = 401;
  return error;
};

// Handle CastError (invalid MongoDB ObjectId)
const handleCastErrorDB = (err: mongoose.Error.CastError): IAppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const error: IAppError = new Error(message);
  error.statusCode = 400;
  return error;
};

// Handle duplicate field value error (MongoDB)
const handleDuplicateFieldsDB = (err: any): IAppError => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value`;
  const error: IAppError = new Error(message);
  error.statusCode = 400;
  return error;
};

// Handle validation error (MongoDB)
const handleValidationErrorDB = (err: mongoose.Error.ValidationError): IAppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  const error: IAppError = new Error(message);
  error.statusCode = 400;
  return error;
};

// Handle Zod validation error
const handleZodError = (err: ZodError): IAppError => {
  const message = `Validation error: ${err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')}`;
  const error: IAppError = new Error(message);
  error.statusCode = 400;
  return error;
};

// Send error response in development environment
const sendErrorDev = (err: IAppError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Send error response in production environment
const sendErrorProd = (err: IAppError, res: Response): void => {
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
  err: IAppError,
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