import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { userInfoStore } from 'lib/zustand/userStore';
import NoticeDetail from 'components/NoticeDetail';
import NoticeMain from 'components/NoticeMain';

const DataBoardPage = () => {
  const { user } = userInfoStore();

  return (
    <Routes>
      <Route element={<NoticeMain user={user} type="data" />} path="/" />
      <Route element={<NoticeDetail user={user} type="data" />} path="/:id" />
    </Routes>
  );
};

export default DataBoardPage;
