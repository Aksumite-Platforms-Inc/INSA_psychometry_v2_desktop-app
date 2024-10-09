import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles: string[];
}

function ProtectedRoute({ element, roles }: ProtectedRouteProps) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.indexOf(auth.role) === -1) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
}
export default ProtectedRoute;
