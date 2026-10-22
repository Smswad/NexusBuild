import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import chatRoutes from './routes/chat.routes.js';
import mapRoutes from './routes/map.routes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.middleware.js';

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'NexusBuild API',
        timestamp: new Date().toISOString(),
    });
});

// ── Mount Route Modules ───────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/inquiries', leadsRoutes); // Semantic alias for customer inquiries
app.use('/api/chat', chatRoutes);
app.use('/api', mapRoutes); // Provides /api/resolve-map

// ── Error Handling Middleware ─────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = env.PORT || 5001;
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(` NexusBuild API listening on port ${PORT}`);
    });
}

export default app;
