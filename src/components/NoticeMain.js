import { postStore } from 'lib/zustand/postStore';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Article from './Board/Article';
import oc from 'open-color';
import WriteBoard from './Board/WriteBoard';
import NoticeTemplate from './NoticeTemplate';

const columns = ['번호', '분류', '작성자', '제목', '등록일', '조회수'];

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

const NoticeMain = ({ user, type }) => {
  const { postsList, getPosts, postPosts } = postStore();
  const [isWrite, setIsWrite] = useState(false);

  useEffect(() => {
    getPosts(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWrite]);

  const onChangeWrite = () => {
    setIsWrite(!isWrite);
  };

  return (
    <NoticeTemplate type={type}>
      <>
        <button onClick={onChangeWrite}>{isWrite ? '목록' : '글쓰기'}</button>
        {isWrite && (
          <WriteBoard close={onChangeWrite} postPosts={postPosts} user={user} />
        )}
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
              {postsList.map((post, i) => (
                <Article post={post} key={post._id} idx={i + 1} type={type} />
              ))}
            </tbody>
          </Table>
        )}
      </>
    </NoticeTemplate>
  );
};

export default NoticeMain;
