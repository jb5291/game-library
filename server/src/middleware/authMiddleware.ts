import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface JwtPayload {
  id: string;
  username: string;
}

export const protect = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Add user to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};