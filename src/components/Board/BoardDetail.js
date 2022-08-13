import axios from 'axios';
import { postStore } from 'lib/zustand/postStore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import NoticeTemplate from './BoardTemplate';
import * as XLSX from 'xlsx';
import WriteBoard from './WriteBoard.js';
import { useNavigate } from 'react-router-dom';
import oc from 'open-color';

const Container = styled.div`
  width: 100%;
  background: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 0px 20px;

  margin: 20px 0px;
`;

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px 0px;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  flex: 1;
  font-size: 24px;
  font-weight: 550;
  text-align: center;
`;

const Sub = styled.div`
  font-weight: 400;
  font-size: 13px;

  span {
    font-weight: 550;
  }
`;

const Body = styled.div`
  width: 80%;
  border: 1px solid black;
  border-radius: 10px;
  margin: 20px 0px;

  > div {
    /* text-align: center; */
    padding: 0px 20px;
    width: 100%;
    overflow: auto;
  }
`;

const Files = styled.div`
  width: 80%;
  font-size: 20px;
  margin-bottom: 20px;
`;

const FlexDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const Button = styled.button`
  background: ${oc.indigo[5]};
  color: white;
  border: none;
  border-radius: 5px;
  width: 100px;
  font-size: 17px;
  font-weight: 550;
  padding: 10px 0px;
  margin-left: 10px;
  cursor: pointer;

  ${(props) =>
    props.del &&
    css`
      background: ${oc.red[7]};
    `}
`;

const BoardDetail = ({ user, type }) => {
  const { id } = useParams();
  const { getDetailPost, removePost, postPosts } = postStore();
  const [post, setPost] = useState(null);
  const { username } = user;
  const [isWrite, setIsWrite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('test');
    (async () => {
      let res = await getDetailPost('notice', id);
      setPost(res);
    })();
  }, [getDetailPost, id, isWrite]);

  console.log(post);

  const downLoadFile = async (fileName, fileId) => {
    const res = await axios.get(`/posts/download/${fileId}`);
    if (res.status === 200) {
      const worksheet = XLSX.utils.json_to_sheet(res.data.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, `${fileName}`);
    } else {
      alert('파일 다운에 실패했습니다.');
    }
  };

  const onClickDelPost = async () => {
    let res = await removePost(id);
    if (res) {
      alert('게시글이 삭제되었습니다.');
      navigate(-1);
    }
  };

  const onChangeWrite = () => {
    setIsWrite(!isWrite);
  };

  const delSaveFile = (i) => {
    let tmpOrgNames = post.orgFileName.slice();
    let tmpSaveNames = post.saveFileName.slice();
    tmpOrgNames.splice(i, 1);
    tmpSaveNames.splice(i, 1);
    setPost({
      ...post,
      orgFileName: tmpOrgNames,
      saveFileName: tmpSaveNames,
    });
  };

  return (
    <NoticeTemplate type={type}>
      {isWrite && (
        <WriteBoard
          close={onChangeWrite}
          postPosts={postPosts}
          user={user}
          id={post._id}
          postData={post}
          deleteFile={delSaveFile}
        />
      )}
      {!isWrite && post && (
        <Container>
          <Contents>
            <Header>
              <Title>{post.title}</Title>
              <Sub>
                <div>
                  <span>작성자</span> {post.author}
                </div>
                {post.author !== 'admin' && (
                  <div>
                    <span>회사코드</span> {post.companyCode}
                  </div>
                )}
                <div>
                  <span>작성일</span>
                  {post.createdAt.substr(0, 16).replace('T', ' ')}
                </div>
                {post.updatedAt && (
                  <div>
                    <span>최근 수정일</span>
                    {post.updatedAt.substr(0, 16).replace('T', ' ')}
                  </div>
                )}
                <div>
                  <span>조회수</span> {post.views}
                </div>
              </Sub>
            </Header>
            {post.body && (
              <Body>
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              </Body>
            )}
            {!!post.orgFileName.length && (
              <Files>
                첨부파일(다운로드)
                {post.orgFileName.map((file, i) => (
                  <div key={i}>
                    <button
                      onClick={() => downLoadFile(file, post.saveFileName[i])}
                    >
                      {file}
                    </button>
                  </div>
                ))}
              </Files>
            )}
          </Contents>
        </Container>
      )}
      {!post && <>Loading...</>}
      {!isWrite && post && (
        <FlexDiv>
          {post.author === username && (
            <Button onClick={onChangeWrite}>수정하기</Button>
          )}
          {(post.author === username || username === 'admin') && (
            <Button del onClick={onClickDelPost}>
              삭제하기
            </Button>
          )}
        </FlexDiv>
      )}
    </NoticeTemplate>
  );
};

export default BoardDetail;

// https://developer-talk.tistory.com/328
