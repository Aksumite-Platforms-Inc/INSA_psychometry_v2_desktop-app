import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/UserList';
import Tests from '../pages/Tests/TestsList';
import Reports from '../pages/Reports/Reports';
import Profile from '../pages/Users/profile';
import TestPage from '../pages/Tests/TestPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests"
          element={
            <ProtectedRoute>
              <Tests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tests/:id"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
