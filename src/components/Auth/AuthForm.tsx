import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import OpenColor from 'open-color';
import { userInfoStore, userStore } from 'lib/zustand/userStore';
import { AuthFormProps } from 'interfaces/User.interface';

const AuthContainer = styled.main`
  margin-top: 70px;
  background: ${OpenColor.gray[1]};
  border-radius: 10px;
  box-shadow: 0px 0px 4px ${OpenColor.indigo[3]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 700px;
  padding: 30px 40px;
  @media screen and (max-width: 768px) {
    width: 80vw;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const Title = styled.header`
  font-size: 30px;
  font-weight: 550;
  margin-bottom: 30px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputStyle = css`
  padding: 0;
  margin: 0;
  font-size: 17px;
  width: 100%;
  height: 50px;
  padding-left: 30px;
  border: 2px solid gray;
  border-radius: 10px;
  :focus {
    box-shadow: 0 0 0 2px black;
    outline: none;
  }
  margin-bottom: 20px;
`;

const Input = styled.input`
  ${InputStyle};
`;

const Select = styled.select`
  ${InputStyle};
`;

const Button = styled.button`
  cursor: pointer;
  width: 100%;
  font-size: 20px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: ${OpenColor.indigo[2]};
  color: white;
  :hover {
    background: ${OpenColor.indigo[3]};
    transition: 0.3s;
  }
`;

const LinkDiv = styled(Link)`
  margin-top: 20px;
  text-decoration: none;
  color: ${OpenColor.gray[6]};
  :hover {
    color: ${OpenColor.gray[9]};
    transition: 0.3s;
  }
`;

const Error = styled.div`
  color: ${OpenColor.red[5]};
  font-size: 18px;
  font-weight: 450;
  margin-bottom: 20px;
`;

// key가 string으로 접근은 불가함([key: string]: string)
type SiteObj = {
  [key: string]: string;
};

const siteObj: SiteObj = {
  login: '로그인',
  signUp: '회원가입',
};

type TypeProps = {
  type: string;
  authForm: AuthFormProps;
};

const AuthForm = ({ type, authForm }: TypeProps) => {
  const next = type === 'login' ? 'signUp' : 'login';
  const {
    onChangeAuth,
    companyCodes,
    initAuthForm,
    onSubmitAuth,
    error,
    signUpCheck,
    loginCheck,
    checkAuth,
  } = userStore();
  const { user } = userInfoStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      initAuthForm(type);
    };
  }, [initAuthForm, type]);

  useEffect(() => {
    if (signUpCheck) {
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
      initAuthForm(type);
      return;
    }
    if (loginCheck) {
      alert('로그인이 완료되었습니다.');
      initAuthForm(type);
      checkAuth();
      return;
    }
  }, [signUpCheck, navigate, initAuthForm, type, checkAuth, loginCheck]);

  return (
    <AuthContainer>
      <Title>{siteObj[type]}</Title>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitAuth(type);
        }}
      >
        <InputContainer>
          {Object.keys(authForm).map((key: string, i: number) => {
            if (authForm[key].type === 'select') {
              return (
                <Select
                  key={key}
                  onChange={(e) => onChangeAuth(type, key, e.target.value)}
                  defaultValue="default"
                >
                  <option value="default" disabled>
                    회사를 선택해주세요. (회사명/회사코드)
                  </option>
                  {Object.keys(companyCodes).map((e) => (
                    <option value={companyCodes[e]} key={e}>
                      {e}
                    </option>
                  ))}
                  <option value="etc">회사코드 직접 입력</option>
                </Select>
              );
            } else {
              return (
                <Input
                  key={key}
                  placeholder={authForm[key].placeHolder}
                  type={authForm[key].type}
                  value={authForm[key].value}
                  onChange={(e) => onChangeAuth(type, key, e.target.value)}
                />
              );
            }
          })}
        </InputContainer>
        <Error>{error}</Error>
        <Button>{siteObj[type]}</Button>
      </Form>
      <LinkDiv to={`/${next}`}>{siteObj[next]}</LinkDiv>
    </AuthContainer>
  );
};

export default AuthForm;
