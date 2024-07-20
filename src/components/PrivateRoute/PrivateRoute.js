import React from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRoute({children}) {
    const isAuthenticated = localStorage.getItem('username'); // Check if the username is stored in localStorage
    return isAuthenticated ? children : <Navigate to="/" />;
}

export default PrivateRoute
