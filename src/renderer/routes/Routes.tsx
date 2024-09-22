import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import AdminDashboard from '../pages/Dashboard/AdminDashboard';

function AppRoutes(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
