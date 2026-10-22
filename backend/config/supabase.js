import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    console.warn('[config/supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(env.SUPABASE_URL || '', env.SUPABASE_ANON_KEY || '');

export const supabaseAdmin = env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(env.SUPABASE_URL || '', env.SUPABASE_SERVICE_ROLE_KEY)
    : supabase;

export default supabase;
