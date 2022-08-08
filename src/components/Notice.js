import { postStore } from 'lib/zustand/postStore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Article from './Board/Article';
import oc from 'open-color';
import WriteBoard from './Board/WriteBoard';

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0px 20px;
`;

const FlexBox = styled.div`
  width: 100%;
  background: ${oc.indigo[0]};
  border-radius: 10px;
  box-shadow: 2px 2px 2px 2px ${oc.indigo[3]};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;

  > button {
    background: ${oc.indigo[5]};
    color: white;
    border: none;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 150px;
    font-size: 17px;
    font-weight: 550;
    padding: 10px 0px;
    cursor: pointer;
  }
`;

const Header = styled.h1`
  margin: 0;
  margin-bottom: 20px;
`;

const Table = styled.table`
  border-top: 2px solid ${oc.indigo[3]};
  border-bottom: 2px solid ${oc.indigo[3]};
  width: 100%;
  border-collapse: collapse;

  thead {
    th {
      cursor: pointer;
    }
  }

  tbody {
    border-top: 2px solid ${oc.indigo[3]};
    tr {
      :hover {
        background: ${oc.indigo[1]};
        transition: 0.15s;
      }
      text-align: center;
    }
  }

  th,
  td {
    padding: 10px;
  }
`;

const columns = ['번호', '분류', '작성자', '제목', '등록일', '조회수'];

const Notice = () => {
  const { noticePosts, getNoticePosts, postPosts } = postStore();
  const [isWrite, setIsWrite] = useState(false);

  useEffect(() => {
    getNoticePosts();
  }, []);

  const onChangeWrite = () => {
    setIsWrite(!isWrite);
  };

  return (
    <Container>
      <FlexBox>
        <Header>공지사항</Header>
        <button onClick={onChangeWrite}>{isWrite ? '목록' : '글쓰기'}</button>
        {isWrite && <WriteBoard close={onChangeWrite} postPosts={postPosts} />}
        {!isWrite && (
          <Table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noticePosts.map((post, i) => (
                <Article post={post} key={post._id} idx={i + 1} />
              ))}
            </tbody>
          </Table>
        )}
      </FlexBox>
    </Container>
  );
};

export default Notice;
