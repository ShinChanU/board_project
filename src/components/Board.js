import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import Post from './Post';
import CreatePost from './CreatePost';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${oc.gray[3]};
  background: ${oc.gray[6]};
  border-radius: 10px;
  margin: 50px;
  min-height: 300px;
  padding: 20px 50px 50px 50px;
`;

const Title = styled.div`
  font-size: 30px;
  color: white;
  margin-bottom: 20px;
`;

const Contents = styled.div`
  background: ${oc.gray[3]};
  border-radius: 10px;
  width: 100%;
  flex: 1;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

const Button = styled.button`
  border-radius: 10px;
  height: 50px;
  font-size: 20px;
  margin: 10px;
  cursor: pointer;
`;

const Board = () => {
  const [post, setPost] = useState(null);
  const [createPost, setCreatePost] = useState(false);
  const [data, setData] = useState(null);

  const getPostData = async () => {
    let res = await axios.get('http://localhost:5000/posts/');
    console.log(res);
    if (res.status === 200) {
      setPost(res.data);
    }
  };

  const delPostData = async (id) => {
    let res = await axios.delete(`http://localhost:5000/posts/${id}`);
    console.log(res);
    if (res.status === 200) {
      getPostData();
    }
  };

  const createPostData = async (input, data) => {
    if (data === null) {
      let res = await axios.post('http://localhost:5000/posts/', {
        title: input.title,
        contents: input.contents,
      });
      if (res.status === 200) {
        setCreatePost(!createPost);
        getPostData();
      }
    } else {
      console.log(data);
      let res = await axios.post(`http://localhost:5000/posts/${data._id}`, {
        title: input.title,
        contents: input.contents,
      });
      if (res.status === 200) {
        setCreatePost(!createPost);
        getPostData();
      }
    }
  };

  useEffect(() => {
    getPostData();
    console.log(post);
  }, []);

  const onClickPostBtn = () => {
    setCreatePost(!createPost);
    setData(null);
  };

  const updateData = (data) => {
    setData(data);
    setCreatePost(true);
  };

  return (
    <Container>
      <Title>게시판</Title>
      <Button onClick={onClickPostBtn}>
        {createPost ? '닫기' : '게시글 작성'}
      </Button>
      {/* 게시글 작성 버튼 */}
      <Contents>
        {createPost && (
          <CreatePost
            createPostData={createPostData}
            data={data}
            open={createPost}
          />
        )}
        {!createPost &&
          post !== null &&
          post.map((e, i) => (
            <Post
              key={i}
              index={i}
              data={e}
              delPostData={delPostData}
              updateData={updateData}
            />
          ))}
        {!createPost && (post === null || !post.length) && (
          <>게시글이 존재하지 않습니다.</>
        )}
      </Contents>
    </Container>
  );
};

export default Board;
