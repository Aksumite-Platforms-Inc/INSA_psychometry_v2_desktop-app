import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  userRole: string;
  allowedRoles: string[];
}

function PrivateRoute({ children, userRole, allowedRoles }: PrivateRouteProps) {
  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/unauthorized" />
  );
}

export default PrivateRoute;
