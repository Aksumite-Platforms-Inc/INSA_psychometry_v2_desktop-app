import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> =
  function AuthProvider({ children }) {
    const [auth, setAuth] = useState<any>(null);

    const value = React.useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
