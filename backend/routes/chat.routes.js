import express from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { chatSchema } from '../validators/schemas.js';

const router = express.Router();

// POST /api/chat
router.post('/', validate(chatSchema), handleChat);

export default router;
