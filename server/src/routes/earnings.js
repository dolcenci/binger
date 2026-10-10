// ---------------------------------------------------------
// /api/earnings routes — artist only.
// ---------------------------------------------------------
import { Router } from 'express';
import {
    getBanking,
    saveBanking,
    claimEarnings,
    listPayouts,
} from '../controllers/earningsController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('artist'));

router.get('/banking',  getBanking);
router.put('/banking',  saveBanking);
router.post('/claim',   claimEarnings);
router.get('/payouts',  listPayouts);

export default router;