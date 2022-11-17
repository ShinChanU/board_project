import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import OpenColor from 'open-color';
import LoginPage from './pages/Auth/LoginPage';
import NavBar from './components/common/NavBar';
import SignUpPage from 'pages/Auth/SignUpPage';
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
    <Container>
      <Router>
        <NavBar />
        <header>
          <Header to="/">Board Project</Header>
        </header>
        <Routes>
          <Route path="/" element={<BoardPage type="notice" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/noticeBoard/*" element={<BoardPage type="notice" />} />
          <Route path="/dataBoard/*" element={<BoardPage type="data" />} />
          <Route path="/etcBoard/*" element={<BoardPage type="etc" />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
