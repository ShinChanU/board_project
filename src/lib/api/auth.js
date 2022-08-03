import axios from 'axios';

export const postSignup = async ({ username, password, companyCode }) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/register', {
      username: username.value,
      password: password.value,
      companyCode: companyCode.value,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};

export const postLogin = async ({ username, password }) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/login', {
      username: username.value,
      password: password.value,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};
