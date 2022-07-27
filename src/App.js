import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./components/Main";

function App() {
  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
