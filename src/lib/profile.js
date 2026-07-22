import { supabase } from './supabaseClient';

export async function fetchProfile(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
        .from('Registration')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.warn('[Profile] Failed to fetch:', error.message);
        return null;
    }
    return data;
}
