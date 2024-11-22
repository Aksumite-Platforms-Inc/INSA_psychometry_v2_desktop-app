import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string; // The user's role (e.g., org_admin, org_member, branch_admin)
  name: string; // The user's name
  exp: number; // Expiration time (in seconds since Unix epoch)
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactElement;
  allowedRoles?: string[];
}) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // If no token, redirect to login
    console.warn('No token found. Redirecting to login.');
    return <Navigate to="/login" />;
  }

  try {
    // Decode the token
    const decoded: DecodedToken = jwtDecode(token);

    // Log the decoded role for debugging
    console.log('Decoded role from token:', decoded.role, decoded.name);

    // Check if the token is expired
    if (decoded.exp * 1000 < Date.now()) {
      console.warn('Token expired. Redirecting to login.');
      localStorage.removeItem('authToken');
      return <Navigate to="/login" />;
    }

    // Check if the user's role is allowed
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      console.warn('Unauthorized role:', decoded.role);
      return <Navigate to="/unauthorized" />;
    }

    // If all checks pass, render the child component
    return children;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('authToken');
    return <Navigate to="/login" />;
  }
}

ProtectedRoute.defaultProps = {
  allowedRoles: [], // If no roles are specified, allow all authenticated users
};

export default ProtectedRoute;
