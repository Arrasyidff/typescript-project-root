import { IUserDocument } from '../models/user.model';

declare global {
  namespace Express {
    // Extend Express Request interface
    interface Request {
      user?: IUserDocument;
    }
  }

  // Define AuthenticatedRequest interface globally
  interface AuthenticatedRequest extends Express.Request {
    user: IUserDocument; // Note: non-optional here
  }
}

export {};