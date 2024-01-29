// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AccessDeniedPage from './pages/AccessDeniedPage'

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const token = localStorage.getItem('accesToken');
  if (!token) {
    return <Navigate to="/" />;
  }

  const decodedToken = jwtDecode(token);
  const isAllowed = allowedRoles.includes(decodedToken.RolID);

  if (!isAllowed) {
    return <AccessDeniedPage />;
  }

  return <Component />;
};

export default ProtectedRoute;
