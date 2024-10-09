import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/users';
// import ProtectedRoute from './routes/ProtectedRoute';
// import Unauthorized from './pages/Auth/Unauthorized';
import Tests from './pages/Tests/TestsList';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Users/profile';

import './App.css';

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
    // <AuthProvider>
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/unauthorized" element={<Unauthorized />} />
    //     <Route
    //       path="/dashboard"
    //       element={
    //         <ProtectedRoute
    //           element={<Dashboard />}
    //           roles={['organization_admin', 'branch_admin', 'user']}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/tests"
    //       element={
    //         <ProtectedRoute
    //           element={<Tests />}
    //           roles={['organization_admin', 'branch_admin', 'user']}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/reports"
    //       element={
    //         <ProtectedRoute
    //           element={<Reports />}
    //           roles={['organization_admin', 'branch_admin', 'user']}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/users"
    //       element={
    //         <ProtectedRoute
    //           element={<Users />}
    //           roles={['organization_admin']}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/profile"
    //       element={
    //         <ProtectedRoute
    //           element={<Profile />}
    //           roles={['organization_admin', 'branch_admin', 'user']}
    //         />
    //       }
    //     />
    //   </Routes>
    // </AuthProvider>
  );
}

export default App;
