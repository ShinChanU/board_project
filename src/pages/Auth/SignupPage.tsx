import React from 'react';
import AuthForm from '../../components/Auth/AuthForm';
// import { userStore } from 'lib/zustand/userStore.js';

type InputData = 'placeHolder' | 'type' | 'value';

interface SignUp {
  [key: string]: InputData;
}

const signup: SignUp = {
  username: {
    placeHolder: '아이디',
    type: 'text',
    value: '',
  },
  password: {
    placeHolder: '비밀번호',
    type: 'password',
    value: '',
  },
  passwordCheck: {
    placeHolder: '비밀번호 확인',
    type: 'password',
    value: '',
  },
  realName: {
    placeHolder: '이름',
    type: 'text',
    value: '',
  },
  companyCode: {
    placeHolder: '회사 코드',
    type: 'select',
    value: '',
  },
};

const SignupPage = () => {
  // const { signup } = userStore();

  return <AuthForm type="signup" authForm={signup} />;
};

export default SignupPage;
