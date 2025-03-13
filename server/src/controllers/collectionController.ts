import { Response } from 'express';
import Collection from '../models/Collection';
import { AuthRequest } from '../middleware/authMiddleware';

// Get user's collections
export const getUserCollections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Find all collections created by the user
    const collections = await Collection.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('games', 'title imageUrl developer releaseYear');
    
    res.status(200).json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific collection
export const getCollectionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Find the collection
    const collection = await Collection.findById(collectionId)
      .populate('games', 'title imageUrl developer releaseYear genre rating completed progress');
    
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    
    // Check if the collection is public or belongs to the user
    if (!collection.isPublic && collection.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to view this collection' });
      return;
    }
    
    res.status(200).json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new collection
export const createCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { name, description, isPublic, coverImage, games } = req.body;
    
    // Create new collection
    const collection = new Collection({
      name,
      description,
      isPublic: isPublic !== undefined ? isPublic : false,
      coverImage,
      games: games || [],
      user: userId
    });
    
    await collection.save();
    
    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a collection
export const updateCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const { name, description, isPublic, coverImage } = req.body;
    
    // Find the collection
    const collection = await Collection.findById(collectionId);
    
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    
    // Check if the collection belongs to the user
    if (collection.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this collection' });
      return;
    }
    
    // Update collection fields
    collection.name = name || collection.name;
    collection.description = description !== undefined ? description : collection.description;
    collection.isPublic = isPublic !== undefined ? isPublic : collection.isPublic;
    collection.coverImage = coverImage !== undefined ? coverImage : collection.coverImage;
    collection.updatedAt = new Date();
    
    await collection.save();
    
    res.status(200).json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a collection
export const deleteCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Find the collection
    const collection = await Collection.findById(collectionId);
    
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    
    // Check if the collection belongs to the user
    if (collection.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this collection' });
      return;
    }
    
    await Collection.findByIdAndDelete(collectionId);
    
    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add games to a collection
export const addGamesToCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collectionId = req.params.id;
    const userId = req.user?.id;
    const { gameIds } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
      res.status(400).json({ message: 'No game IDs provided' });
      return;
    }
    
    // Find the collection
    const collection = await Collection.findById(collectionId);
    
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    
    // Check if the collection belongs to the user
    if (collection.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this collection' });
      return;
    }
    
    // Add games to collection (avoiding duplicates)
    const currentGameIds = collection.games.map(game => game.toString());
    const newGameIds = gameIds.filter(id => !currentGameIds.includes(id));
    
    if (newGameIds.length > 0) {
      collection.games = [...collection.games, ...newGameIds];
      collection.updatedAt = new Date();
      await collection.save();
    }
    
    // Return updated collection with populated games
    const updatedCollection = await Collection.findById(collectionId)
      .populate('games', 'title imageUrl developer releaseYear');
    
    res.status(200).json(updatedCollection);
  } catch (error) {
    console.error('Error adding games to collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a game from a collection
export const removeGameFromCollection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const collectionId = req.params.id;
    const gameId = req.params.gameId;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    // Find the collection
    const collection = await Collection.findById(collectionId);
    
    if (!collection) {
      res.status(404).json({ message: 'Collection not found' });
      return;
    }
    
    // Check if the collection belongs to the user
    if (collection.user.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this collection' });
      return;
    }
    
    // Remove the game from the collection
    collection.games = collection.games.filter(game => game.toString() !== gameId);
    collection.updatedAt = new Date();
    
    await collection.save();
    
    res.status(200).json({ message: 'Game removed from collection', collection });
  } catch (error) {
    console.error('Error removing game from collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 