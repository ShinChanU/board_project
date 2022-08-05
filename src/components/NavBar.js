import React from 'react';
import { userInfoStore, userStore } from 'lib/zustand/user';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { user } = userInfoStore();
  const { logout } = userStore();

  return (
    <div>
      {!user && (
        <>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/myPage">내 기록</Link>
          <Link to="/board">게시판</Link>
          <button onClick={logout}>로그아웃</button>
        </>
      )}
    </div>
  );
};
export default NavBar;
