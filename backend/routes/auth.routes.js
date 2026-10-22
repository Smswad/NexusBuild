import express from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me (Protected)
router.get('/me', authMiddleware, getMe);

export default router;
