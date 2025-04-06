import dotenv from 'dotenv';
import path from 'path';
import { Secret } from 'jsonwebtoken';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // MongoDB configuration
  mongoUri: process.env.NODE_ENV === 'test' 
    ? process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/test_database'
    : process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
  
  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || 'fallback_jwt_secret_not_for_production' as Secret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
};