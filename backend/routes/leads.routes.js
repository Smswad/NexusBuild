import express from 'express';
import { createLead, getLeads } from '../controllers/leads.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware.js';
import { inquirySchema } from '../validators/schemas.js';

const router = express.Router();

// POST /api/leads or POST /api/inquiries
router.post('/', validate(inquirySchema), createLead);

// GET /api/leads (Admin Only)
router.get('/', authMiddleware, requireAdmin, getLeads);

export default router;
