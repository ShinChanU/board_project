import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from 'pages/Other/MainPage.js';
import SignupPage from 'pages/Auth/SignupPage.js';
import LoginPage from 'pages/Auth/LoginPage.js';
import styled from 'styled-components';
import NavBar from 'components/common/NavBar.js';
import OpenColor from 'open-color';
import ProtectedRoute from 'lib/router/ProtectedRoute.js';
import BoardPage from 'pages/Board/BoardPage.js';
import FootballPage from 'pages/Other/FootballPage.js';

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
        {/* <Header to="/">Chan Board Project</Header> */}
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <BoardPage type="notice" />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/noticeBoard/*"
            element={
              <ProtectedRoute>
                <BoardPage type="notice" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dataBoard/*"
            element={
              <ProtectedRoute>
                <BoardPage type="data" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/etcBoard/*"
            element={
              <ProtectedRoute>
                <BoardPage type="etc" />
              </ProtectedRoute>
            }
          />
          <Route path="/football/*" element={<FootballPage />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
