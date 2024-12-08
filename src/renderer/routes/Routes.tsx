import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import OrgUsers from '../pages/Users/OrgUsersList';
import BranchUsers from '../pages/Users/BranchUsersList';
import Branches from '../pages/Branches/Branches';
import Tests from '../pages/Tests/TestsList';
import Reports from '../pages/Reports/Reports';
import Profile from '../pages/Users/profile';
import TestPage from '../pages/Tests/TestPage';
import BranchDetails from '../pages/Branches/BranchDetails';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../pages/Unauthorized';

function AppRoutes(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['org_admin', 'branch_admin']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orgUsers"
          element={
            <ProtectedRoute allowedRoles={['org_admin']}>
              <OrgUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/branchUsers"
          element={
            <ProtectedRoute allowedRoles={['branch_admin']}>
              <BranchUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <ProtectedRoute allowedRoles={['org_admin', 'branch_admin']}>
              <Branches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/branches/:branchId"
          element={
            <ProtectedRoute allowedRoles={['org_admin']}>
              <BranchDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute
              allowedRoles={['org_admin', 'branch_admin', 'org_member']}
            >
              <Tests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['org_admin']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={['org_admin', 'branch_admin', 'org_member']}
            >
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route
          path="/test/:testId"
          element={
            <ProtectedRoute
              allowedRoles={['org_admin', 'branch_admin', 'org_member']}
            >
              <TestPage />
            </ProtectedRoute>
          }
        />
        {/* Fallback Route */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
