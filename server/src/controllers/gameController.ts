import { Request, Response } from 'express';
import Game, { IGame } from '../models/Game';

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
export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      genre, 
      platform, 
      releaseYear, 
      developer, 
      publisher, 
      rating, 
      imageUrl,
      completed,
      notes
    } = req.body;

    // Create new game with all fields
    const newGame = new Game({
      title,
      description,
      genre,
      platform,
      releaseYear,
      developer,
      publisher,
      rating,
      imageUrl,
      completed: completed || false,
      notes: notes || ''
    });

    // Save the game
    await newGame.save();
    
    res.status(201).json(newGame);
  } catch (error: any) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      message: 'Error creating game', 
      error: error.message 
    });
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