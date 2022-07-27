import React, { useState } from "react";
import styled, { css } from "styled-components";

const List = styled.div`
  /* width: 100%; */
  margin: 0px 20px;
  padding: 20px 30px;
  border-bottom: 2px solid #868e96;
`;
const Div = styled.div`
  font-size: 25px;
  display: flex;
  justify-content: space-between;
`;
// const Container = styled.div``;
// const Container = styled.div``;
const Detail = styled.div`
  display: none;

  ${(props) =>
    props.open &&
    css`
      display: block;
    `}
`;

const Post = ({ index, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickBtn = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <List>
      <Div>
        {index + 1} {data.title} {data.updatedAt.substr(0, 10)}
        <button onClick={onClickBtn}>{isOpen ? "닫기" : "펼치기"}</button>
      </Div>
      {/* css 적용 필요 */}
      <Detail open={isOpen}>
        {data.contents}
        {/* 수정, 삭제 api 함수 */}
        <button>수정</button> <button>삭제</button>
      </Detail>
    </List>
  );
};

export default Post;
