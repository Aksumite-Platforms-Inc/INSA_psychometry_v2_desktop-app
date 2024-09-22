import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/Routes';
import '../../assets/styles/tailwind.css';
import './App.css';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
