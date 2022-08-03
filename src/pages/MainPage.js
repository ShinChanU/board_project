import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 30px;
  margin-top: 30px;
`;

const MainPage = () => {
  return (
    <div>
      <Header>Web Project</Header>
      <Link to="/login">로그인</Link>
      <Link to="/signup">회원가입</Link>
    </div>
  );
};

export default MainPage;
