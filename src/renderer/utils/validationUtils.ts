import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  name: string;
  role: string;
  exp: number;
}

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const decodeToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getUserName = (): string => {
  const decoded = decodeToken();
  return decoded?.name || 'Unknown User';
};

export const getUserRole = (): string => {
  const decoded = decodeToken();
  if (!decoded) return 'Unknown Role';

  switch (decoded.role) {
    case 'org_member':
      return 'Employee';
    case 'org_admin':
      return 'Organization Admin';
    case 'branch_admin':
      return 'Branch Admin';
    default:
      return decoded.role;
  }
};

export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  if (!decoded) return true;

  return decoded.exp * 1000 < Date.now();
};
