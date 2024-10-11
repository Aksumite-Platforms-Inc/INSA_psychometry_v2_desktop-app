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

  if (!auth || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component exact={exact} path={path} />;
}

ProtectedRoute.defaultProps = {
  exact: false,
  path: '',
};

export default ProtectedRoute;
