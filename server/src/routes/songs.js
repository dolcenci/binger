// ---------------------------------------------------------
// /api/songs routes.
// ---------------------------------------------------------
import { Router } from 'express';
import {
    listSongs,
    topSongs,
    listArtists,
    songsByArtist,
    getSong,
    uploadSongHandler,
    updateSong,
    deleteSong,
    recordPlay,
    myEarnings,
    mySongs,
} from '../controllers/songController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadSong } from '../middleware/upload.js';

const router = Router();

// Public
router.get('/',                 listSongs);
router.get('/top',              topSongs);
router.get('/artists',          listArtists);
router.get('/by-artist/:userId', songsByArtist);

// Artist-only (must come before /:id, or "mine" would be
// interpreted as an id — Express matches in order).
router.get('/mine',          requireAuth, requireRole('artist'), mySongs);
router.get('/mine/earnings', requireAuth, requireRole('artist'), myEarnings);

// Upload / edit / delete (artist only)
router.post('/',         requireAuth, requireRole('artist'), uploadSong, uploadSongHandler);
router.patch('/:id',     requireAuth, requireRole('artist'), uploadSong, updateSong);
router.delete('/:id',    requireAuth, requireRole('artist'), deleteSong);

// Play recording (anyone, but only counted for logged-in users
// who meet the threshold — see controller).
router.post('/:id/play', recordPlay);

// Public single-song (LAST, so /mine etc. match first)
router.get('/:id', getSong);

export default router;