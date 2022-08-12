import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import { postStore } from 'lib/zustand/postStore';

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

const NoticeTemplate = ({ children, type }) => {
  const { postCate } = postStore();

  return (
    <Container>
      <FlexBox>
        <Header>{postCate[type]}</Header>
        {children}
      </FlexBox>
    </Container>
  );
};

export default NoticeTemplate;
