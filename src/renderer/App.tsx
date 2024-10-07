import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/Routes';
import '../../assets/styles/tailwind.css';
import { UserRoleProvider } from './context/UserRoleContext';
import './App.css';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <UserRoleProvider>
        <AppRoutes />
      </UserRoleProvider>
    </AuthProvider>
  );
}

export default App;
