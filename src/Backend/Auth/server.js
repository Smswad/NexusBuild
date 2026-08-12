import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';
import chatRouter from '../Chat/chat.js';

// ── Load .env manually (ESM-compatible, no extra dependency) ─────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../../../.env');
try {
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
    }
} catch {
    console.warn('[server] Could not load .env — ensure env vars are set externally.');
}

const app = express();
app.use(cors());
app.use(express.json());


// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRouter);

app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, phoneNumber, password } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber,
                },
            },
        });

        if (error) throw error;

        return res.status(201).json({
            message: 'Registration successful!',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

//LOGIN
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;


        return res.status(200).json({
            message: 'Login successful',
            session: data.session,
            user: data.user
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(` Backend listening on port ${PORT}`));
}

export default app;