import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Step 1: Create the auth user
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone_number: phoneNumber,
                },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Supabase returns a user with empty identities when email already exists
        if (data.user && data.user.identities?.length === 0) {
            setError('This email is already registered. Please log in instead.');
            setLoading(false);
            return;
        }

        // Step 2: Insert profile row into Registration table
        if (data.user) {
            const { error: profileError } = await supabase
                .from('Registration')
                .insert({
                    id: data.user.id,
                    full_name: fullName,
                    email: email,
                    phone_number: phoneNumber || null,
                });

            if (profileError) {
                // Auth user created but profile insert failed — show warning
                console.warn('Profile insert error:', profileError.message);
            }
        }

        setLoading(false);
        setSuccess('Registration successful! Please check your email to confirm your account.');
        setFullName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit}>
                    <div>
                        <Link to="/">Back</Link>
                    </div>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Register</legend>

                    <label className="label">Full Name</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Shahil Mahmud Swad"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="mail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label">Phone Number</label>
                    <input
                        type="tel"
                        className="tabular-nums input w-full"
                        placeholder="01*********"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />

                    {error && (
                        <p className="text-error text-sm mt-2">{error}</p>
                    )}
                    {success && (
                        <p className="text-success text-sm mt-2">{success}</p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-neutral mt-4"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;