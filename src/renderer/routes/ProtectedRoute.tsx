import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  component: ComponentType<any>;
  allowedRoles: string[];
  exact?: boolean;
  path?: string;
}

function ProtectedRoute({
  component: Component,
  allowedRoles,
  exact,
  path,
}: ProtectedRouteProps) {
  const { auth } = useAuth();

  if (!auth || !auth.token) {
    // If not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(auth.role)) {
    // If logged in but role is unauthorized, redirect to unauthorized
    return <Navigate to="/unauthorized" />;
  }

  // If logged in and authorized, render the component
  return <Component exact={exact} path={path} />;
}

export default ProtectedRoute;
