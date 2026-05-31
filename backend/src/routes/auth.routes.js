import { Router } from 'express';
import { login, register, logout, getMe, refreshToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refreshToken);

export default router;
