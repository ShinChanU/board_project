import React from 'react';
import AuthForm from 'components/Auth/AuthForm';
import { userStore } from 'lib/zustand/userStore';

const SignupPage = () => {
  const { signup } = userStore();

  return <AuthForm type="signup" authForm={signup} />;
};

export default SignupPage;
