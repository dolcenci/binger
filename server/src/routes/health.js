// ---------------------------------------------------------
// GET /api/health — proves server + DB are alive.
// ---------------------------------------------------------
import { Router } from 'express';
import { ping } from '../config/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        const now = await ping();
        res.json({
            ok: true,
            service: 'binger-api',
            db: 'connected',
            time: now,
        });
    } catch (err) {
        err.status = 503;
        err.message = `Database unreachable: ${err.message}`;
        next(err);
    }
});

export default router;