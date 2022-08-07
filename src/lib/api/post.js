import axios from 'axios';

export const createPostData = async ({ companyCode, author, body }) => {
  try {
    const res = await axios.post('/posts', {
      companyCode,
      author,
      body,
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
