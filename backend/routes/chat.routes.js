import express from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatRateLimiter } from '../middleware/rateLimiter.middleware.js';
import { chatSchema } from '../validators/schemas.js';

const router = express.Router();

// POST /api/chat (Per-IP rate limited to 20 req/min)
router.post('/', chatRateLimiter, validate(chatSchema), handleChat);

export default router;
