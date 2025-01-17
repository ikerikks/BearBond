import express from 'express';
import multer from 'multer';

import { signup, login, logout, authVerification } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();
const upload = multer();

router.use(upload.none()); //handle multipart/form-data for form submissions without any file uploads

router.get('/auth-verification', protectRoute, authVerification);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;