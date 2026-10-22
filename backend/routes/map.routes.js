import express from 'express';
import { resolveMap } from '../controllers/map.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { mapQuerySchema } from '../validators/schemas.js';

const router = express.Router();

// GET /api/resolve-map?url=...
router.get('/resolve-map', validate(mapQuerySchema, 'query'), resolveMap);

export default router;
