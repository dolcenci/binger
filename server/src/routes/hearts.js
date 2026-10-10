// ---------------------------------------------------------
// /api/hearts routes.
// ---------------------------------------------------------
import { Router } from 'express';
import { toggleHeart, myHearts, isHearted } from '../controllers/heartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/mine',              requireAuth, myHearts);
router.get('/song/:songId',      requireAuth, isHearted);
router.post('/:songId',          requireAuth, toggleHeart);

export default router;