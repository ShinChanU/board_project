import axios from 'axios';

export const postSignup = async ({
  username,
  password,
  companyCode,
  realName,
}: any) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/register', {
      username: username.value,
      password: password.value,
      companyCode: companyCode.value,
      realName: realName.value,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};

export const postLogin = async ({ username, password }) => {
  try {
    const res = await axios.post(
      '/auth/login',
      {
        username: username.value,
        password: password.value,
      },
      {
        withCredentials: true,
      },
    );
    return res;
  } catch (e) {
    return e.response;
  }
};

export const checkUser = async () => {
  try {
    const res = await axios.get('http://localhost:5000/auth/check', {
      withCredentials: true,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};

export const Logout = async () => {
  try {
    const res = await axios.post('http://localhost:5000/auth/logout');
    return res;
  } catch (e) {
    return e.response;
  }
};
