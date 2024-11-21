import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import AppRoutes from './routes/Routes';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
