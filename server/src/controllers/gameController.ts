import { Request, Response } from 'express';
import Game, { IGame } from '../models/Game';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all games
export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error });
  }
};

// Get a single game by ID
export const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game', error });
  }
};

// Create a new game
export const createGame = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Add the user ID to the game data
    const gameData = {
      ...req.body,
      user: userId  // This is the critical line
    };
    
    const game = new Game(gameData);
    await game.save();
    
    res.status(201).json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a game
export const updateGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Log the update request
    console.log(`Updating game ${id} with data:`, req.body);
    
    // Make sure all fields are properly handled
    const updateData = { 
      ...req.body,
      // Ensure completed is a boolean
      completed: req.body.completed !== undefined ? Boolean(req.body.completed) : undefined
    };
    
    const updatedGame = await Game.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedGame) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }
    
    console.log('Game updated successfully:', updatedGame);
    res.status(200).json(updatedGame);
  } catch (error: any) {
    console.error('Error updating game:', error);
    res.status(500).json({ 
      message: 'Error updating game', 
      error: error.message 
    });
  }
};

// Delete a game
export const deleteGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      res.status(404).json({ message: 'Game not found' });
      return;
    }
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game', error });
  }
};