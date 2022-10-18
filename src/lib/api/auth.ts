import axios, { AxiosError } from 'axios';
import { AuthFormProps } from 'interfaces/User.interface';

export const postSignUp = async ({
  username,
  password,
  companyCode,
  realName,
}: AuthFormProps) => {
  try {
    const res = await axios.post('http://localhost:5000/auth/register', {
      username: username.value,
      password: password.value,
      companyCode: companyCode.value,
      realName: realName.value,
    });
    return res;
  } catch (e) {
    // const { response } = e as unknown as AxiosError;

    // if (response) {
    //   throw { status: response.status, data: response.data };
    // }

    throw e;
  }
};

export const postLogin = async ({ username, password }: AuthFormProps) => {
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
    throw e;
  }
};

export const checkUser = async () => {
  try {
    const res = await axios.get('http://localhost:5000/auth/check', {
      withCredentials: true,
    });
    return res;
  } catch (e) {
    throw e;
  }
};

export const Logout = async () => {
  try {
    const res = await axios.post('http://localhost:5000/auth/logout');
    return res;
  } catch (e) {
    throw e;
  }
};
