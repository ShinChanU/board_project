import create from 'zustand';
import * as authAPI from 'lib/api/auth';
import { persist } from 'zustand/middleware';

export const userInfoStore = create(
  persist(
    (set, get) => ({
      user: null,
    }),
    {
      name: 'user',
      getStorage: () => sessionStorage,
    },
  ),
);

export const userStore = create((set, get) => ({
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

  signup: {
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

  error: '',

  signupCheck: null,
  loginCheck: null,

  onChangeAuth: (form, name, val) => {
    if (name === 'companyCode' && val === 'etc') {
      set({
        [form]: {
          ...get()[form],
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
        ...get()[form],
        [name]: {
          ...get()[form][name],
          value: val,
        },
      },
    });
  },

  initAuthForm: (form) => {
    let formObj = get()[form];
    for (let name in formObj) get().onChangeAuth(form, name, '');
    set({ signupCheck: null });
    set({ loginCheck: null });
  },

  onSubmitAuth: async (form) => {
    let authForm = get()[form];
    if (form === 'signup') {
      const { password, passwordCheck, companyCode } = authForm;
      if (isNaN(+companyCode.value)) {
        set({ error: '회사코드는 숫자만 입력해주세요.' });
        return;
      }
      if (password.value !== passwordCheck.value) {
        set({ error: '패스워드가 다릅니다' });
        return;
      }
      let res = await authAPI.postSignup(authForm);
      if (res.status === 201) set({ signupCheck: true });
      else set({ error: res.data.message });
      return;
    } else {
      let res = await authAPI.postLogin(authForm);
      if (res.status === 200) {
        userInfoStore.setState({ user: res.data });
        set({ loginCheck: true });
      } else set({ error: res.data.message });
      return;
    }
  },

  checkAuth: async () => {
    let res = await authAPI.checkUser();
    console.log(res);
  },

  logout: async () => {
    let res = await authAPI.Logout();
    if (res.status === 200) {
      userInfoStore.setState({ user: null });
    }
  },
}));
