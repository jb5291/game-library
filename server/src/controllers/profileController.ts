import { Request, Response } from 'express';
import User from '../models/User';
import Game from '../models/Game';
import { AuthRequest } from '../middleware/authMiddleware';

// Get user's profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Find user by ID but exclude password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { username, email, bio, avatarUrl } = req.body;
    
    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username, 
        email, 
        bio, 
        avatarUrl,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's games
export const getUserGames = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Find all games created by the user
    const games = await Game.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update game progress/status
export const updateGameProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Check if userId exists
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const gameId = req.params.id;
    const { completed, progress, notes } = req.body;
    
    // Find the game
    const game = await Game.findById(gameId);
    
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }
    
    // Check if game.user exists
    if (!game.user) {
      res.status(400).json({ message: 'Game has no associated user' });
      return;
    }
    
    // Check if the game belongs to the user
    if (game.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this game' });
      return;
    }
    
    // Update game progress fields
    game.completed = completed !== undefined ? completed : game.completed;
    game.progress = progress !== undefined ? progress : game.progress;
    game.notes = notes !== undefined ? notes : game.notes;
    game.updatedAt = new Date();
    
    console.log('Game:', game);
    console.log('Game user:', game.user);
    console.log('User ID:', userId);
    
    await game.save();
    
    res.status(200).json(game);
  } catch (error) {
    console.error('Error updating game progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 