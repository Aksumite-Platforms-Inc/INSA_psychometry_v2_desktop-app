import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to manually decode a JWT
function decodeJWT(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

interface AuthContextType {
  auth: { token: string | null; role: string | null } | null;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // Added loading state to indicate when auth is being initialized
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{
    token: string | null;
    role: string | null;
  } | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    // On page load, retrieve the token from localStorage and set the auth state
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeJWT(token);
      // Check if the token is valid and not expired
      if (decodedToken.exp * 1000 > Date.now()) {
        setAuth({ token, role: decodedToken.role });
      } else {
        // Remove the token if it's expired
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // Set loading to false after checking auth
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      const { token } = response.data;
      const decodedToken = decodeJWT(token);

      // Set auth state and store token in localStorage
      setAuth({ token, role: decodedToken.role });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  // Logout function
  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page after logout
  };

  const value = React.useMemo(
    () => ({ auth, setAuth, login, logout, loading }),
    [auth, loading],
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
