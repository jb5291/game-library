import { Router } from 'express';
import { 
  getUserCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addGamesToCollection,
  removeGameFromCollection
} from '../controllers/collectionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Collection routes
router.get('/', getUserCollections);
router.get('/:id', getCollectionById);
router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);
router.post('/:id/games', addGamesToCollection);
router.delete('/:id/games/:gameId', removeGameFromCollection);

export default router; 