import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login';
// import AdminDashboard from '../pages/Dashboard/AdminDashboard';
import Dashboard from '../pages/Dashboard/Dashboard';
import Users from '../pages/Users/users';
import Tests from '../pages/Tests/TestsList';
import Reports from '../pages/Reports/Reports';
import Profile from '../pages/Users/profile';
import TestPage from '../pages/Tests/TestPage';

function AppRoutes(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test/:testId" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
