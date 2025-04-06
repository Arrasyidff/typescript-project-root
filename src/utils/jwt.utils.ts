// @ts-nocheck
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

/**
 * Menghasilkan JSON Web Token
 * @param payload Data yang akan disertakan dalam token
 * @returns Token yang dihasilkan
 */
export const generateToken = (payload: any): string => {
  try {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Memverifikasi dan mendekode token
 * @param token Token yang akan diverifikasi
 * @returns Payload yang didekode
 */
export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    throw new Error('Invalid token');
  }
};