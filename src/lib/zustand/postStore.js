import create from 'zustand';
import * as postAPI from 'lib/api/post';
import { persist } from 'zustand/middleware';

export const postStore = create(
  persist(
    (set, get) => ({
      noticePosts: [],

      getDetailPost: async (id) => {
        const res = await postAPI.getPost(id);
        if (res.status === 200) return res.data;
        else return 0;
      },

      getNoticePosts: async () => {
        const res = await postAPI.getNoticePosts();
        if (res.status === 200) set({ noticePosts: res.data.reverse() });
      },

      postPosts: async (id, data) => {
        if (!id) {
          const res = await postAPI.createPostData(data);
          if (res.status === 200) {
            get().getNoticePosts();
            return [1];
          } else if (res.status === 400) {
            return [0, res.data.message];
          } else {
            return [0, 'Error 발생'];
          }
        } else {
          // const res = await postAPI.updatePostData();
          // if (res.status === 200) set({ noticePosts: res.data });
        }
      },
    }),
    {
      name: 'posts',
      getStorage: () => sessionStorage,
    },
  ),
);
