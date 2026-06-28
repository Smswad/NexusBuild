import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess(`Welcome back, ${data.user.email}!`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit}>
                <div>
                    <Link to="/">Back</Link>
                </div>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Login</legend>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        placeholder="mail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;