import NoticeDetail from 'components/NoticeDetail';
import NoticeMain from 'components/NoticeMain';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const NoticePage = () => {
  return (
    <Routes>
      <Route element={<NoticeMain />} path="/" />
      <Route element={<NoticeDetail />} path="/:id" />
    </Routes>
  );
};

export default NoticePage;
