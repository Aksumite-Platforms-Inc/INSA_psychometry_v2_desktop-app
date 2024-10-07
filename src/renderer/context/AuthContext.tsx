import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface AuthContextType {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<any>(null);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      setAuth(response.data);
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token');
  };

  const value = React.useMemo(
    () => ({ auth, setAuth, login, logout }),
    [auth, setAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
