import create from 'zustand';
import * as postAPI from 'lib/api/post';
import { persist } from 'zustand/middleware';

export const userInfoStore = create(
  persist(
    (set, get) => ({
      // 0806 post 관련 store작성, Board 컴포넌트 참고
    }),
    {
      name: 'posts',
      getStorage: () => sessionStorage,
    },
  ),
);
