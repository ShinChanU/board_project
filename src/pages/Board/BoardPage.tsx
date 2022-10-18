import BoardDetail from 'components/Board/BoardDetail';
import BoardList from 'components/Board/BoardList';
import { Route, Routes } from 'react-router-dom';
import { userInfoStore } from 'lib/zustand/userStore';
import LoginPage from '../Auth/LoginPage';
import { BoardUserTypeProps } from 'interfaces/Board.interface';

const BoardPage = ({ type }: BoardUserTypeProps) => {
  const { user } = userInfoStore();

  return (
    <>
      {user && (
        <Routes>
          <Route element={<BoardList user={user} type={type} />} path="/" />
          <Route
            element={<BoardDetail user={user} type={type} />}
            path="/:id"
          />
        </Routes>
      )}
      {!user && <LoginPage />}
    </>
  );
};

export default BoardPage;
