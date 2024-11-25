import { jwtDecode } from 'jwt-decode'; // Correct import

interface DecodedToken {
  branch_id: number | null;
  email: string;
  exp: number;
  iat: number;
  name: string;
  nbf: number;
  org_id: number;
  role: string;
  sub: string;
  user_id: number;
}

export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const decodeToken = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: DecodedToken = jwtDecode(token);
    console.log('decoding token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const getOrgId = (): number | null => {
  const decoded = decodeToken();
  return decoded?.org_id || null; // Update to match the decoded token property
};

export const getUserId = (): number | null => {
  const decoded = decodeToken();
  return decoded?.user_id || null;
};

export const getEmail = (): string => {
  const decoded = decodeToken();
  return decoded?.email || 'Unknown Email';
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

export const getBranchId = (): number | null => {
  const decoded = decodeToken();
  return decoded?.branch_id || null;
};

export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  if (!decoded) return true;

  return decoded.exp * 1000 < Date.now();
};
