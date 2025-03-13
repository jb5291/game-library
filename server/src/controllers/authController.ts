import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      res.status(400).json({ 
        message: 'Please provide username, email and password' 
      });
      return;
    }

    // Log the registration attempt (for debugging)
    console.log('Registration attempt:', { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      res.status(400).json({ 
        message: 'User already exists with that email or username' 
      });
      return;
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });

    // Validate the user object against the schema
    const validationError = newUser.validateSync();
    if (validationError) {
      console.error('Validation error:', validationError);
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.errors 
      });
      return;
    }

    // Save the user
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error: any) {
    // Log the detailed error
    console.error('Error registering user:', error);
    
    // Format the error response
    let errorMessage = 'Error registering user';
    let statusCode = 500;
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      statusCode = 400;
      errorMessage = 'Validation error';
      
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
      
      // Format validation errors
      const formattedErrors: Record<string, string> = {};
      
      for (const field in error.errors) {
        if (error.errors[field].message) {
          formattedErrors[field] = error.errors[field].message;
        }
      }
      
      res.status(statusCode).json({ 
        message: errorMessage,
        errors: formattedErrors
      });
      return;
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      statusCode = 400;
      errorMessage = 'User already exists with that email or username';
      
      res.status(statusCode).json({ message: errorMessage });
      return;
    }
    
    // Generic error response
    res.status(statusCode).json({ message: errorMessage });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error 
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // User is attached to request in auth middleware
    const user = await User.findById((req as any).user.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting user', 
      error 
    });
  }
};