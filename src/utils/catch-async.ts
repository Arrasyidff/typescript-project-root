import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper untuk async functions di controller
 * Menangkap error dan meneruskannya ke middleware error
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};