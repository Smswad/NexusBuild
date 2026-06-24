// import React from 'react';

const Login = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">

                <legend className="fieldset-legend">login</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="mail@gmail.com" />

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="********" />

                <button className="btn btn-neutral mt-4">Login</button>
            </fieldset>
        </div>
    );
};

export default Login;