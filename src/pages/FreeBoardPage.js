import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { userInfoStore } from 'lib/zustand/userStore';
import NoticeDetail from 'components/NoticeDetail';
import NoticeMain from 'components/NoticeMain';

const FreeBoardPage = () => {
  const { user } = userInfoStore();
  return (
    <Routes>
      <Route element={<NoticeMain user={user} type="etc" />} path="/" />
      <Route element={<NoticeDetail user={user} type="etc" />} path="/:id" />
    </Routes>
  );
};

export default FreeBoardPage;
