import express from 'express';
import { getAllProjects, getProjectById, createProject } from '../controllers/projects.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware.js';
import { projectSchema } from '../validators/schemas.js';

const router = express.Router();

// GET /api/projects
router.get('/', getAllProjects);

// GET /api/projects/:id
router.get('/:id', getProjectById);

// POST /api/projects (Admin Only)
router.post('/', authMiddleware, requireAdmin, validate(projectSchema), createProject);

export default router;
