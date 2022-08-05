import React, { useEffect } from 'react';
import { userInfoStore } from 'lib/zustand/userStore';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import oc from 'open-color';
import Board from 'components/Board';

const Container = styled.div``;

const Layout = styled.div`
  background: white;
  height: 500px;

  ${(props) =>
    props.first &&
    css`
      background: ${oc.violet[1]};
    `}
`;

const Contents = styled.div`
  max-width: 1300px;
  margin: 0px auto;
`;

const Divs = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Div = styled.div`
  width: 300px;
  height: 300px;
  border: 1px blue solid;
`;

const MainPage = () => {
  const { user } = userInfoStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Container>
      <Layout>
        <Contents>
          <button>매출 등록하기</button>
          <Divs>
            <Div>전년 대비 10% 증가</Div>
            <Div>전분기 대비 10% 증가</Div>
            <Div>전월 대비 10% 증가</Div>
          </Divs>
        </Contents>
      </Layout>
      <Layout first>
        <Contents>
          세부 게시판
          <Board />
        </Contents>
      </Layout>
    </Container>
  );
};

export default MainPage;
