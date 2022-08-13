import axios from 'axios';

// 게시글 생성
export const createPostData = async (data) => {
  try {
    const res = await axios({
      method: 'post',
      url: '/posts',
      headers: { 'Content-Type': 'multipart/form-data' },
      data,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};

// 카테고리별 게시글 전체 조회
export const getPosts = async (type) => {
  try {
    let res;
    if (type === 'data') {
      let data = await axios.get(`/posts/data`);
      let result = await axios.get(`/posts/result`);
      return (res = { status: 200, data: [...data.data, ...result.data] });
    } else {
      res = await axios.get(`/posts/${type}`);
    }
    return res;
  } catch (e) {
    return e.response;
  }
};

// 세부 게시글 조회
export const getPost = async (category, id) => {
  try {
    const res = await axios.get(`/posts/${category}/${id}`);
    return res;
  } catch (e) {
    return e.response;
  }
};

// 게시글 삭제
export const delPostData = async (id) => {
  try {
    const res = await axios.delete(`/posts/${id}`);
    return res;
  } catch (e) {
    return e.response;
  }
};

// 수정예정
export const updatePostData = async (id, data, saveFiles) => {
  try {
    const res = await axios({
      method: 'post',
      url: `/posts/${id}`,
      headers: { 'Content-Type': 'multipart/form-data' },
      data,
      saveFiles,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};
