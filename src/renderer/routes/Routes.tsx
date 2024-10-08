import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
// import Users from '../pages/Users/users';
import Tests from '../pages/Tests/TestsList';
import Reports from '../pages/Reports/Reports';
import Profile from '../pages/Users/profile';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              roles={['organization_admin', 'branch_admin']}
            />
          }
        />
        <Route path="/tests" element={<Tests />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<Profile />}
              roles={['organization_admin', 'branch_admin', 'user']}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
