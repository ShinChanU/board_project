import axios, { AxiosRequestConfig } from 'axios';

// // 게시글 생성
export const createPostData = async (data: any) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/posts',
      headers: { 'Content-Type': 'multipart/form-data' },
      data,
    });
    return res;
  } catch (e: any) {
    return e.response;
    // throw e;
  }
};

// 카테고리별 게시글 전체 조회
export const getCategoryPosts = async (type: string) => {
  try {
    if (type === 'data') {
      let data = await axios.get(`/posts/data`);
      let result = await axios.get(`/posts/result`);
      console.log(data, result);
      if (data.status === 200 && result.status === 200) {
        return [...result.data.reverse(), ...data.data.reverse()];
      } else return null;
    } else {
      const typeRes = await axios.get(`/posts/${type}`);
      if (typeRes.status === 200) {
        return typeRes.data.reverse();
      } else return null;
    }
  } catch (e) {
    throw e;
  }
};

// 세부 게시글 조회
export const getPost = async (category: any, id: any) => {
  try {
    const res = await axios.get(`/posts/${category}/${id}`);
    return res;
  } catch (e) {
    throw e;
  }
};

// 게시글 삭제
export const delPostData = async (id: any) => {
  try {
    const res = await axios.delete(`/posts/${id}`);
    return res;
  } catch (e) {
    throw e;
  }
};

// 수정예정1018
export const updatePostData = async (id: any, data: any, saveFiles: any) => {
  try {
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `/posts/${id}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        data,
        saveFiles,
      },
    };

    const res = await axios(options);
    return res;
  } catch (e) {
    throw e;
  }
};
