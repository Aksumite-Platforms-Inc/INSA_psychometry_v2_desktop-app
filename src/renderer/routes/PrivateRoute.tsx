// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// interface ProtectedRouteProps {
//   component: React.ComponentType<any>;
//   allowedRoles: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   component: Component,
//   allowedRoles,
// }) => {
//   const { auth } = useAuth();

//   // If the user is not authenticated, redirect to the login page
//   if (!auth) {
//     return <Navigate to="/" />;
//   }

//   // If the user's role is not allowed, redirect to an unauthorized page
//   if (!allowedRoles.includes(auth.role)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return <Component />;
// };

// export default ProtectedRoute;
