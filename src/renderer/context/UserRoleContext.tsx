// UserRoleContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserRoleContextProps {
  role: string;
  setRole: (role: string) => void;
}

const UserRoleContext = createContext<UserRoleContextProps | undefined>(
  undefined,
);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string>('organization_admin'); // Default role

  const value = React.useMemo(() => ({ role, setRole }), [role, setRole]);

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
