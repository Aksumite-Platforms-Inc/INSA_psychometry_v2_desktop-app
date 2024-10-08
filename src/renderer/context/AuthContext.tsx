// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setAuth({ token, role: decodedToken.role });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      const { token } = response.data as { token: string };
      const decodedToken: any = jwtDecode(token);
      setAuth({ token, role: decodedToken.role });
      localStorage.setItem('token', token);
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
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
