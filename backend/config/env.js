import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(__dirname, '../../.env');

// Try dotenv first
dotenv.config({ path: rootEnvPath });

// Fallback manual parser to ensure keys are loaded across all OS/environments
try {
    const envContent = readFileSync(rootEnvPath, 'utf-8');
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
    // Silently continue if .env is missing or env vars are set via system/host
}

export const env = {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SUPABASE_URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_FILE_SEARCH_STORE: process.env.GEMINI_FILE_SEARCH_STORE,
};
