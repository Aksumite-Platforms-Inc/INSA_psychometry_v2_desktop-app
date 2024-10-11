import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Auth/Unauthorized';

// Lazy load components
const Login = lazy(() => import('../pages/Auth/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Users = lazy(() => import('../pages/Users/users'));
const Tests = lazy(() => import('../pages/Tests/TestsList'));
const Reports = lazy(() => import('../pages/Reports/Reports'));
const Profile = lazy(() => import('../pages/Users/profile'));

function AppRoutes(): React.ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              component={Dashboard}
              allowedRoles={['admin', 'user']}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute component={Users} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute
              component={Tests}
              allowedRoles={['admin', 'user']}
            />
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute
              component={Reports}
              allowedRoles={['admin', 'user']}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              component={Profile}
              allowedRoles={['admin', 'user']}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
