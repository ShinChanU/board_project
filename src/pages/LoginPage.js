import React from 'react';
import AuthForm from 'components/Auth/AuthForm';
import { userStore } from 'lib/zustand/user';

const LoginPage = () => {
  const { login } = userStore();

  return <AuthForm type="login" authForm={login} />;
};

export default LoginPage;
