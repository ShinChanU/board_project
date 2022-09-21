import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignupPage from 'pages/Auth/SignupPage';
import LoginPage from 'pages/Auth/LoginPage';
import styled from 'styled-components';
import NavBar from 'components/common/NavBar';
import OpenColor from 'open-color';
import BoardPage from 'pages/Board/BoardPage';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${OpenColor.indigo[1]};
  display: flex;
  flex-direction: column;
  align-items: center;
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
        <Header to="/">엑셀 취합 시스템</Header>
        <Routes>
          <Route path="/" element={<BoardPage type="notice" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/noticeBoard/*" element={<BoardPage type="notice" />} />
          <Route path="/dataBoard/*" element={<BoardPage type="data" />} />
          <Route path="/etcBoard/*" element={<BoardPage type="etc" />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
