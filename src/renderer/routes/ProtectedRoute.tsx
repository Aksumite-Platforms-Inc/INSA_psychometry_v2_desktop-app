import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  component: ComponentType<any>;
  allowedRoles: string[];
}

function ProtectedRoute({
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) {
  const { auth, loading } = useAuth(); // Access the loading state from context

  // Show a loading indicator while auth is being initialized
  if (loading) {
    return <div>Loading...</div>; // You can replace this with your own loading spinner
  }

  if (!auth || !allowedRoles.includes(auth.role!)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
}

export default ProtectedRoute;
