import axios from 'axios';
import { postStore } from 'lib/zustand/postStore.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import NoticeTemplate from './BoardTemplate.js';
import * as XLSX from 'xlsx';
import WriteBoard from './WriteBoard.js';
import { useNavigate } from 'react-router-dom';
import oc from 'open-color';

const Container = styled.div`
  width: 100%;
  background: white;
  border: 2px solid ${oc.indigo[1]};
  border-radius: 10px;
  /* padding: 0px 40px; */

  margin: 20px 0px;
  > div {
    padding: 0px 40px;
  }
`;

const Title = styled.div`
  margin: 20px 0px;
  /* flex: 1; */
  font-size: 24px;
  font-weight: 550;
  text-align: center;
`;

const Sub = styled.div`
  font-weight: 400;
  font-size: 13px;
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: right; */
  padding: 0px 40px;

  div {
    /* text-align: right; */
    width: auto;
  }
  span {
    font-weight: 550;
  }
`;

const Body = styled.div`
  width: 100%;
  background: ${oc.indigo[1]};
  margin: 20px 0px;

  > div {
    /* text-align: center; */
    padding: 20px 20px;

    width: 100%;
    overflow: auto;
    /* border: 1px solid black; */
    /* border-radius: 10px; */
  }
`;

const Files = styled.div`
  width: 100%;
  font-size: 20px;
  margin-bottom: 20px;

  button {
    padding: 5px 10px;
    border-radius: 10px;
    background: none;
    font-size: 15px;
    margin-top: 10px;
    cursor: pointer;
    border: 2px solid ${oc.gray[5]};
    :hover {
      background: ${oc.indigo[7]};
      color: white;
      border-color: ${oc.indigo[7]};
      transition: 0.1s linear;
    }
    :active {
      transform: translateY(5px);
    }
  }
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
    (async () => {
      let res = await getDetailPost('notice', id);
      setPost(res);
    })();
  }, [getDetailPost, id, isWrite]);

  const downLoadFile = async (fileName, fileId) => {
    let res;
    if (fileName === fileId) {
      let resultDate;
      let [year, monCycle] = fileName.split(' ')[0].split('년_');
      let secDate;
      if (monCycle.includes('월')) {
        secDate = monCycle.split('월')[0];
        resultDate = `${year}_${secDate}-mon`;
      }
      res = await axios.get(`/posts/download/result/${resultDate}`);
    } else {
      res = await axios.get(`/posts/download/${fileId}`);
    }
    if (res) {
      if (res.status === 200) {
        const worksheet = XLSX.utils.json_to_sheet(res.data.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${fileName}`);
      } else {
        alert('파일 다운에 실패했습니다.');
      }
    } else {
      console.log('res없음');
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
          {/* <Header> */}
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
          {/* </Header> */}
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
                    📄 {file}
                  </button>
                </div>
              ))}
            </Files>
          )}
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
