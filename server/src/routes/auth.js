import { Router } from 'express';
import { validateToken } from '../middleware/validateToken.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { login, logout, getMe } from '../controllers/authController.js';
import { validateLogin } from '../validators/index.js';

const router = Router();

// Microsoft token → backend session token
router.post('/login', validateLogin, validateToken, login);

// Invalidate session (client should clear token; we log the action)
router.post('/logout', requireAuth, logout);

// Return current admin profile
router.get('/me', requireAuth, getMe);

export default router;
