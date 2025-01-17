import express from 'express';
import multer from 'multer';

import { getUserProfile, getSuggestedUsers, updateUserProfile } from '../controllers/user.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();
const upload = multer();
// all of the routes are protected: can't execute if not authenticated
router.use(upload.none());

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.post('/update', protectRoute, updateUserProfile);

export default router;