// import React from 'react';

const Register = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <label className="label">Full Name</label>
                <input type="text" className="input" placeholder="Shahil Mahmud Swad" />

                <legend className="fieldset-legend">Register</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="mail@gmail.com" />

                <label className="label">Phone Number</label>
                <label className="flex items-center gap-2">
                    <input type="tel" className="tabular-nums input w-full" placeholder="01*********" />
                </label>

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="********" />

                <button className="btn btn-neutral mt-4">Register</button>
            </fieldset>
        </div>
    );
};

export default Register;