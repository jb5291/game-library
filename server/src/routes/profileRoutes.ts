import { Router } from 'express';
import { getProfile, updateProfile, getUserGames, updateGameProgress } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/games', getUserGames);
router.put('/games/:id', updateGameProgress);

export default router; 