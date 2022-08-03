import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from 'pages/MainPage';
import SignupPage from 'pages/SignupPage';
import LoginPage from 'pages/LoginPage';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
`;

function App() {
  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Container>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
