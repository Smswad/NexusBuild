import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);


export async function handleSignIn(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return { success: true, session: data.session };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


export async function handleRegister(formData) {
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const phoneNumber = formData.get('phoneNumber');
    const password = formData.get('password');

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

        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}