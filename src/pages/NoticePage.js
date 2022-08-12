import React from 'react';
import NoticeDetail from 'components/NoticeDetail';
import NoticeMain from 'components/NoticeMain';
import { Route, Routes } from 'react-router-dom';
import { userInfoStore } from 'lib/zustand/userStore';

const NoticePage = () => {
  const { user } = userInfoStore();

  return (
    <Routes>
      <Route element={<NoticeMain user={user} type="notice" />} path="/" />
      <Route element={<NoticeDetail user={user} type="notice" />} path="/:id" />
    </Routes>
  );
};

export default NoticePage;
