import React from 'react';
import AuthForm from 'components/Auth/AuthForm.js';
import { userStore } from 'lib/zustand/userStore.js';

const SignupPage = () => {
  const { signup } = userStore();

  return <AuthForm type="signup" authForm={signup} />;
};

export default SignupPage;
