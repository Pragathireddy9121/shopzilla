import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.isAdmin ? children : <Navigate to="/" />;
};

export default RequireAdmin;
