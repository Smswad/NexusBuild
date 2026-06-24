import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';

const app = express();
app.use(cors());
app.use(express.json());


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Backend listening on port ${PORT}`));