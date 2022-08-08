import axios from 'axios';

// 0809
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

export const getPostData = async () => {
  try {
    const res = await axios.get('/posts');
    return res;
  } catch (e) {
    return e.response;
  }
};

// 0809
export const getNoticePosts = async () => {
  try {
    const res = await axios.get('/posts');
    return res;
  } catch (e) {
    return e.response;
  }
};

export const delPostData = async (id) => {
  try {
    const res = await axios.delete(`/posts/${id}`);
    return res;
  } catch (e) {
    return e.response;
  }
};

// 수정예정
export const updatePostData = async (id, data) => {
  const { companyCode, author, body } = data;
  try {
    const res = await axios.post(`posts/${id}`, {
      companyCode,
      author,
      body,
    });
    return res;
  } catch (e) {
    return e.response;
  }
};
