// import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Pages/Root/Root';
import Error from '../Pages/ErrorPage/Error';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Projects from '../Pages/Projects/Projects';
import Gismap from '../Pages/Gismap/Gismap';
import About from '../Pages/About/About';
import Contact from '../Pages/Contact/Contact';

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <Error></Error>,
        children: [
            {
                index: true,
                path: "/",
                Component: Home,
            },
        ]
    },
    {
        path: "/login",
        Component: Login
    },
    {
        path: "/register",
        Component: Register
    },
    {
        path: "/projects",
        Component: Projects

    },
    {
        path: "/gismap",
        Component: Gismap

    },
    {
        path: "/about",
        Component: About

    },
    {
        path: "/contact",
        Component: Contact

    },
]);