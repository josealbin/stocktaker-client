import React from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('username');
    if (isAuthenticated === null) return null; // optionally show loading
    return isAuthenticated ? children : <Navigate to="/" replace />;
  }

export default PrivateRoute
