// import React from 'react';

import { Link } from "react-router";

const Navbar = () => {
    const links = <>
    <Link to="/projects"><li className="mr-[1.37rem]">Projects</li></Link>
    <Link to="/gismap"><li className="mr-[1.37rem]">GIS Map</li></Link>
    <Link to="/about"><li className="mr-[1.37rem]">About</li></Link>
    <Link to="/contact"><li className="">Contact</li></Link> 
    </>
    return (
        <div className="navbar bg-base-100 shadow-sm  ">
            <div className="navbar-start ml-[2.741rem]">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">NexusBuild</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end mr-[2.741rem]">
                {/* Search Box */}
                <label className="input">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" required placeholder="Search" />
                </label>
                {/* Login */}
                <Link to="/login" className="btn">Login</Link>
                {/* Register */}
                <Link to="/register" className="btn">Register</Link>
            </div>
        </div>
    );
};

export default Navbar;