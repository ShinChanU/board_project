import create from 'zustand';
import * as postAPI from 'lib/api/post';
import { persist } from 'zustand/middleware';
import { BoardDetailDataProps } from 'interfaces/Board.interface';
import { StringProps } from 'interfaces/User.interface';

interface PostProps {
  postsList: [] | BoardDetailDataProps[];
  postCate: StringProps;
  getDetailPost: (
    category: string,
    id: string,
  ) => Promise<BoardDetailDataProps | null>;
  getPosts: (type: string) => void;
  removePost: (type: string, id: string) => Promise<boolean>;
  postPosts: (
    id: string,
    formData: FormData,
    postData: BoardDetailDataProps,
    type: string,
  ) => Promise<[boolean, string]>;
}

export const postStore = create<PostProps, any>(
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
        else return null;
      },

      // 메뉴별 게시글 전체 조회
      getPosts: async (type) => {
        const res = await postAPI.getCategoryPosts(type);
        console.log(res);
        if (res) {
          set({ postsList: res });
        }
      },

      removePost: async (type: string, id: string) => {
        const res = await postAPI.delPostData(id);
        if (res.status === 200) {
          get().getPosts(type);
          return true;
        } else {
          console.log('데이터 삭제 실패');
          return false;
        }
      },

      postPosts: async (id, data, postData, type) => {
        console.log(id, data, postData, type);
        let res;
        if (!id) {
          res = await postAPI.createPostData(data);
        } else {
          let saveFiles = postData.saveFileName;
          res = await postAPI.updatePostData(id, data, saveFiles);
        }
        if (res.status === 200) {
          get().getPosts(type);
          return [true, ''];
        } else if (res.status === 400) {
          return [false, res.data.message];
        } else {
          return [false, 'Error 발생'];
        }
      },
    }),
    {
      name: 'posts',
      getStorage: () => sessionStorage,
    },
  ),
);

// 1018 백엔드에서 보내줄때 등록일 기준
