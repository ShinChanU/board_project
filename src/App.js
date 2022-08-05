import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import SignupPage from 'pages/SignupPage';
import LoginPage from 'pages/LoginPage';
import styled from 'styled-components';
import NavBar from 'components/NavBar';
import BoardPage from 'pages/BoardPage';
import MyPage from 'pages/MyPage';

const Container = styled.div`
  min-height: 100vh;
`;

const Header = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 30px;
  margin-top: 30px;
`;

function App() {
  return (
    <BrowserRouter>
      <Container>
        <NavBar />
        <Header to="/">Web Project</Header>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/board" element={<BoardPage />}></Route>
          <Route path="/myPage" element={<MyPage />}></Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
