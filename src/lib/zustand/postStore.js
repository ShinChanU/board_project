import create from 'zustand';
import * as postAPI from 'lib/api/post.js';
import { persist } from 'zustand/middleware';

export const postStore = create(
  persist(
    (set, get) => ({
      // 게시판에 보여줄 게시글들
      postsList: [],

      // 게시판 메뉴
      postCate: {
        notice: '공지사항',
        data: '자료취합 게시판',
        etc: '자유 게시판',
      },

      // 세부 게시글 조회
      getDetailPost: async (category, id) => {
        const res = await postAPI.getPost(category, id);
        if (res.status === 200) return res.data;
        else return 0;
      },

      // 메뉴별 게시글 전체 조회
      getPosts: async (type) => {
        const res = await postAPI.getPosts(type);
        if (res.status === 200) set({ postsList: res.data.reverse() });
        return res;
      },

      removePost: async (id) => {
        const res = await postAPI.delPostData(id);
        if (res.status === 200) {
          set({ postList: get().postsList.filter((post) => post._id !== id) });
          return 1;
        } else {
          console.log('데이터 삭제 실패');
          return 0;
        }
      },

      postPosts: async (id, data, postData) => {
        let res;
        if (!id) {
          res = await postAPI.createPostData(data);
        } else {
          let saveFiles = postData.saveFileName;
          res = await postAPI.updatePostData(id, data, saveFiles);
        }
        if (res.status === 200) {
          get().getPosts();
          return [1];
        } else if (res.status === 400) {
          return [0, res.data.message];
        } else {
          return [0, 'Error 발생'];
        }
      },
    }),
    {
      name: 'posts',
      getStorage: () => sessionStorage,
    },
  ),
);
