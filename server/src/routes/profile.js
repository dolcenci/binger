// ---------------------------------------------------------
// /api/profile routes.
// ---------------------------------------------------------
import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    updateProfilePhoto,
} from '../controllers/profileController.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadProfilePhoto } from '../middleware/upload.js';

const router = Router();

router.get('/me',    requireAuth, getProfile);
router.put('/me',    requireAuth, updateProfile);
router.post('/photo', requireAuth, uploadProfilePhoto, updateProfilePhoto);

export default router;