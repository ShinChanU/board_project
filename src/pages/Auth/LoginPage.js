import React from 'react';
import AuthForm from 'components/Auth/AuthForm.js';
import { userStore } from 'lib/zustand/userStore.js';

const LoginPage = () => {
  const { login } = userStore();

  return <AuthForm type="login" authForm={login} />;
};

export default LoginPage;
