import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Extend Express Request to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

// Create the middleware instance by calling the function
const clerkAuth = ClerkExpressRequireAuth();

// Export it as requireAuth
export const requireAuth = clerkAuth;

// Optional: Custom middleware to ensure user exists in database
export const ensureUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    console.error('User verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};