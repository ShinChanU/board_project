import React, { useState } from 'react';
import styled, { css } from 'styled-components';

const List = styled.div`
  width: 70%;
  margin: 0px 20px;
  padding: 20px 30px;
  border-bottom: 2px solid #868e96;
`;

const Div = styled.div`
  font-size: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
// const Container = styled.div``;
// const Container = styled.div``;
const Detail = styled.div`
  display: none;

  ${(props) =>
    props.open &&
    css`
      display: flex;
      flex-direction: column;
      width: 70%;
      border: 1px solid gray;
      border-radius: 20px;
      margin: 20px auto;
    `}
`;

const Button = styled.button`
  cursor: pointer;
`;

const Num = styled.div`
  color: red;
`;
const Title = styled.div``;

const Date = styled.div`
  font-size: 12px;
`;

const DetailContents = styled.div`
  margin: 30px 0px;
  text-align: center;
  /* font-size: 12px; */
`;

const Btn = styled.div`
  display: flex;
  margin: 10px;
  justify-content: center;
  button {
    margin: 0 30px;
  }
`;

const Post = ({ index, data, delPostData, updateData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickBtn = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <List>
      <Div>
        <Num>{index + 1}</Num>
        <Title>{data.title}</Title>
        <Date>{data.updatedAt}</Date>
        <Button onClick={onClickBtn}>{isOpen ? '닫기' : '펼치기'}</Button>
      </Div>
      {/* css 적용 필요 */}
      <Detail open={isOpen}>
        <DetailContents>{data.contents}</DetailContents>

        {/* 수정, 삭제 api 함수 */}
        <Btn>
          <Button onClick={() => updateData(data)}>수정</Button>
          <Button onClick={() => delPostData(data._id)}>삭제</Button>
        </Btn>
      </Detail>
    </List>
  );
};

export default Post;
