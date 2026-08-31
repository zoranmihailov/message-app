import express from 'express';
import { getAllProfiles, getProfile, updateProfile } from '../controllers/profilesController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getAllProfiles);
router.get('/:id', getProfile);
router.patch('/:id', requireAuth, updateProfile);

export default router;