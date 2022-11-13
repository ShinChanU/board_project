import AuthForm from '../../components/Auth/AuthForm';
import { userStore } from 'lib/zustand/userStore';

const SignUpPage = () => {
  const { signUp } = userStore();

  return <AuthForm type="signUp" authForm={signUp} />;
};

export default SignUpPage;
