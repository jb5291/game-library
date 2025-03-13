import { Router } from 'express';
import { 
  getGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame 
} from '../controllers/gameController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', protect, createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;