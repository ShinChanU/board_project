import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import oc from "open-color";
import Post from "./Post";

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
`;

const Board = () => {
  const [post, setPost] = useState(null);

  const getPostData = async () => {
    let res = await axios.get("http://localhost:5000/posts/");
    if (res.status === 200 && res.data.length) {
      setPost(res.data);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  return (
    <Container>
      <Title>게시판</Title>
      {/* 게시글 작성 버튼 */}
      <Contents>
        {post !== null &&
          post.map((e, i) => <Post key={i} index={i} data={e} />)}
      </Contents>
    </Container>
  );
};

export default Board;
