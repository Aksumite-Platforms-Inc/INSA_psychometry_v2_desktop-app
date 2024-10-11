import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Function to manually decode a JWT
function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

interface AuthContextType {
  auth: { token: string | null; role: string | null } | null;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{
    token: string | null;
    role: string | null;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = decodeJWT(token); // Manually decode the token
      if (decodedToken.exp * 1000 > Date.now()) {
        setAuth({ token, role: decodedToken.role });
      } else {
        localStorage.removeItem('token');
        setAuth(null);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      const { token } = response.data as { token: string };
      const decodedToken: any = decodeJWT(token); // Manually decode the token

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

  const value = React.useMemo(() => ({ auth, setAuth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
