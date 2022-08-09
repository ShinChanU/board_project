import axios from 'axios';
import { postStore } from 'lib/zustand/postStore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import NoticeTemplate from './NoticeTemplate';
import * as XLSX from 'xlsx';

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

const NoticeDetail = () => {
  const { id } = useParams();
  const { getDetailPost } = postStore();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      let res = await getDetailPost(id);
      setPost(res);
    })();
  }, [getDetailPost, id]);

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

  return (
    <NoticeTemplate>
      <Container>
        {post && (
          <Contents>
            <Header>
              <Title>{post.title}</Title>
              <Sub>
                <div>
                  <span>작성자</span> {post.author}
                </div>
                <div>
                  <span>회사코드/회사</span> {post.companyCode}
                </div>
                <div>
                  <span>작성일</span> {post.createdAt}
                </div>
                <div>
                  <span>조회수</span> {post.views}
                </div>
              </Sub>
            </Header>
            <Body>
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </Body>
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
              <></>
            </Files>
          </Contents>
        )}
        {!post && <>Loading...</>}
      </Container>
    </NoticeTemplate>
  );
};

export default NoticeDetail;

// https://developer-talk.tistory.com/328
