import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import oc from 'open-color';
import { userInfoStore, userStore } from 'lib/zustand/userStore';

const Container = styled.div`
  width: 100%;
  background: ${oc.indigo[0]};
  padding: 0px 30px;
`;

const Header = styled.header<any>`
  width: 100%;

  margin: 0 auto;
  display: flex;
  justify-content: end;

  max-width: 1300px;
  padding: 10px 0px;
  height: 40px;
  align-items: center;

  ${(props) =>
    props.user &&
    css`
      justify-content: space-between;
    `}
`;

const TagStyle = css`
  font-size: 20px;
  font-weight: 550;
  margin-left: 20px;
`;

const LinkStyle = css`
  text-decoration: none;
  color: black;
`;

const LinkDiv = styled(Link)`
  ${TagStyle};
  ${LinkStyle};
  :hover {
    color: ${oc.indigo[4]};
    transition: 0.3s;
  }
`;

const Button = styled.button`
  border: none;
  background: ${oc.indigo[0]};
  ${TagStyle};
  :hover {
    color: ${oc.indigo[4]};
    transition: 0.3s;
  }
`;

const Div = styled.div`
  ${TagStyle};
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

const IconLink = styled(Link)`
  display: flex;
  ${LinkStyle};
`;

const Span = styled.span`
  color: ${oc.indigo[6]};
`;

const NavBar = () => {
  const { user } = userInfoStore();
  const { logout } = userStore();

  return (
    <Container>
      {!user && (
        <Header>
          <LinkDiv to="/login">로그인</LinkDiv>
          <LinkDiv to="/signUp">회원가입</LinkDiv>
        </Header>
      )}
      {user && (
        <Header user>
          <Div>
            <IconLink to="/">
              {/* <img src={logo} alt="icon" /> */}
              <Span>{user.realName}</Span> 님 환영합니다!
            </IconLink>
          </Div>
          <div>
            <LinkDiv to="/noticeBoard">📌공지사항</LinkDiv>
            <LinkDiv to="/dataBoard">📈자료취합게시판</LinkDiv>
            <LinkDiv to="/etcBoard">🌟자유게시판</LinkDiv>
            <Button onClick={logout}>로그아웃</Button>
          </div>
        </Header>
      )}
    </Container>
  );
};
export default NavBar;
