import React from 'react';
import styled from 'styled-components';

const Tr = styled.tr``;

const Article = ({ post, idx }) => {
  return (
    <Tr>
      <td>{idx}</td>
      <td>공지</td>
      <td>{post.author.substr(0, 6)}</td>
      <td>{post.title}</td>
      <td>{post.createdAt.substr(0, 10)}</td>
      <td>{idx}</td>
    </Tr>
  );
};

export default Article;

// 0808 공지사항 post 스키마 재작성, user도 재작성 필요(admin(공지사항 입력), top(5팀), user(나머지 회사 사원))
// 작성 수정 삭제 기능 추가 => 작성 폼 확립
// 엑셀 양식 업로드
// 자료취합 게시판은 공지사항 테이블과 유사하지만 회사코드나 회사명이 들어가고
// 권한에 따라 작성, 수정, 삭제 기능 부여, 조회는 누구나 가능
// 그리고 업로드한 엑셀 자료를 형식이 맞는지 검증하고 맞다면 db에 알맞게 저장, 안 맞으면 에러 출력