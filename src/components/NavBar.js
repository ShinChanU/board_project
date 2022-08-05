import React from 'react';
import { userInfoStore, userStore } from 'lib/zustand/userStore';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import oc from 'open-color';

const Container = styled.div`
  background: white;
`;

const Header = styled.header`
  margin: 0 auto;
  display: flex;
  justify-content: end;
  ${(props) =>
    props.user &&
    css`
      justify-content: space-between;
    `}
  max-width: 1300px;
  padding: 10px 0px;
  height: 40px;
  align-items: center;
`;

const TagStyle = css`
  font-size: 20px;
  font-weight: 550;
  margin-left: 20px;
  text-decoration: none;
  color: black;
`;

const LinkDiv = styled(Link)`
  ${TagStyle};
  :hover {
    color: ${oc.violet[3]};
    transition: 0.3s;
  }
`;

const Button = styled.button`
  border: none;
  background: white;
  ${TagStyle};
  :hover {
    color: ${oc.violet[3]};
    transition: 0.3s;
  }
`;

const Div = styled.div`
  ${TagStyle};
`;

const Span = styled.span`
  color: ${oc.violet[6]};
`;

const NavBar = () => {
  const { user } = userInfoStore();
  const { logout } = userStore();

  return (
    <Container>
      {!user && (
        <Header>
          <LinkDiv to="/login">로그인</LinkDiv>
          <LinkDiv to="/signup">회원가입</LinkDiv>
        </Header>
      )}
      {user && (
        <Header user>
          <Div>
            <Span>{user.realName}</Span> 님 환영합니다!
          </Div>
          <div>
            <LinkDiv to="/myPage">내 기록</LinkDiv>
            <LinkDiv to="/board">게시판</LinkDiv>
            <Button onClick={logout}>로그아웃</Button>
          </div>
        </Header>
      )}
    </Container>
  );
};
export default NavBar;
