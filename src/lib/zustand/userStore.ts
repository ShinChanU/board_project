import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as authAPI from 'lib/api/auth';
import {
  AuthFormProps,
  StringProps,
  UserTokenProps,
} from 'interfaces/User.interface';

interface UserInfoProps {
  user: null | UserTokenProps;
}

interface UserStoreProps {
  login: AuthFormProps;
  signUp: AuthFormProps;
  companyCodes: StringProps;
  error: null | string;
  signUpCheck: boolean;
  loginCheck: boolean;
  onChangeAuth: (form: string, name: string, val: string) => void;
  initAuthForm: (form: string) => void;
  onSubmitAuth: (form: string) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const userInfoStore = create<UserInfoProps>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
      }),
      {
        name: 'user',
        getStorage: () => sessionStorage,
      },
    ),
  ),
);

export const userStore = create<UserStoreProps>((set, get) => ({
  login: {
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
  },

  signUp: {
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
  },

  companyCodes: {
    'Naver/0000': '0000',
    'Kakao/2000': '2000',
    'Line/4000': '4000',
    'Coupang/6000': '6000',
    'Baemin/8000': '8000',
  },

  error: null,
  signUpCheck: false,
  loginCheck: false,

  onChangeAuth: (form, name, val) => {
    let formState;
    if (form === 'login') formState = get().login;
    else formState = get().signUp;
    if (name === 'companyCode' && val === 'etc') {
      set({
        [form]: {
          ...formState,
          [name]: {
            placeHolder: '회사 코드(숫자만)',
            type: 'text',
            value: '',
            max: 4,
          },
        },
      });
      return;
    }
    set({ error: '' });
    set({
      [form]: {
        ...formState,
        [name]: {
          ...formState[name],
          value: val,
        },
      },
    });
  },

  initAuthForm: (form) => {
    let formState;
    if (form === 'login') formState = get().login;
    else formState = get().signUp;
    for (const name in formState) get().onChangeAuth(form, name, '');
    set({ signUpCheck: false });
    set({ loginCheck: false });
  },

  onSubmitAuth: async (form) => {
    let formState;
    if (form === 'login') {
      formState = get().login;
      const res = await authAPI.postLogin(formState);
      if (res.status === 200) {
        userInfoStore.setState({ user: res.data });
        set({ loginCheck: true });
      } else if (res.status === 504) {
        set({ error: '서버와 연결 되어있지 않습니다.' });
      } else set({ error: res.data.message });
      return;
    } else {
      formState = get().signUp;
      const { password, passwordCheck, companyCode } = formState;
      if (isNaN(+companyCode.value)) {
        set({ error: '회사코드는 숫자만 입력해주세요.' });
        return;
      }
      if (password.value !== passwordCheck.value) {
        set({ error: '패스워드가 다릅니다' });
        return;
      }
      const res = await authAPI.postSignUp(formState);
      if (res.status === 201) set({ signUpCheck: true });
      else set({ error: res.data.message });
      return;
    }
  },

  checkAuth: async () => {
    await authAPI.checkUser();
  },

  logout: async () => {
    const res = await authAPI.Logout();
    if (res.status === 200) {
      userInfoStore.setState({ user: null });
    }
  },
}));
