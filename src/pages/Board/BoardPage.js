import React from 'react';
import BoardDetail from 'components/Board/BoardDetail.js';
import BoardList from 'components/Board/BoardList.js';
import { Route, Routes } from 'react-router-dom';
import { userInfoStore } from 'lib/zustand/userStore.js';

const BoardPage = ({ type }) => {
  const { user } = userInfoStore();

  return (
    <Routes>
      <Route element={<BoardList user={user} type={type} />} path="/" />
      <Route element={<BoardDetail user={user} type={type} />} path="/:id" />
    </Routes>
  );
};

export default BoardPage;
