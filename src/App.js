import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import SignupPage from 'pages/SignupPage';
import LoginPage from 'pages/LoginPage';
import styled from 'styled-components';
import NavBar from 'components/NavBar';
import BoardPage from 'pages/BoardPage';
import OpenColor from 'open-color';
import NoticePage from 'pages/NoticePage';

const Container = styled.div`
  min-height: 100vh;
  background: ${OpenColor.indigo[1]};
`;

const Header = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 30px;
  margin: 30px 0px;
`;

function App() {
  return (
    <BrowserRouter>
      <Container>
        <NavBar />
        <Header to="/">Web Project</Header>
        <Routes>
          {/* <Route path="/" element={<MainPage />}> */}
          {/* 0809 회원인증 라우터 필요 */}
          <Route path="/" element={<NoticePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/notice/*" element={<NoticePage />} />
          <Route path="/board" element={<BoardPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
