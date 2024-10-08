import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/users';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorized from './pages/Auth/Unauthorized';
import './App.css';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              roles={['organization_admin', 'branch_admin', 'user']}
            />
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={<Users />}
              roles={['organization_admin']}
            />
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
