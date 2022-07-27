import React from "react";
import styled from "styled-components";
import Board from "./Board";

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 700;
  font-size: 30px;
  margin-top: 30px;
`;

const Main = () => {
  return (
    <>
      <Header>Web Project</Header>
      <Board />
    </>
  );
};

export default Main;
