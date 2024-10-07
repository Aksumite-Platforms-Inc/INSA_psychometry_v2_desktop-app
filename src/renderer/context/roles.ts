// roles.ts
export const ROLES = {
  ORGANIZATION_ADMIN: 'organization_admin',
  BRANCH_ADMIN: 'branch_admin',
  USER: 'user',
};

export const PERMISSIONS = {
  [ROLES.ORGANIZATION_ADMIN]: [
    'dashboard',
    'users',
    'tests',
    'reports',
    'profile',
    'branches',
  ],
  [ROLES.BRANCH_ADMIN]: ['dashboard', 'users', 'tests', 'profile'],
  [ROLES.USER]: ['tests', 'profile'],
};
