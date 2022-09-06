import React from 'react';
import { userInfoStore } from 'lib/zustand/userStore.js';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = userInfoStore();

  const isLogin = () => {
    return user ? true : false;
  };

  if (!isLogin()) {
    return <Navigate to={process.env.PUBLIC_URL + '/login'} />;
  }

  return children;
};

export default ProtectedRoute;
