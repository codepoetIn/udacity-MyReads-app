import { Route, Routes } from "react-router-dom";
import "./App.css";
import ListBooks from "./ListBooks";
import SearchBooks from "./SearchBooks";
import React from "react";
import DetailsBook from "./DetailsBook";

const App = () => {
  
  return (
    <Routes>
      <Route path="/" element={<ListBooks/>} />
      <Route path="/search" element={<SearchBooks/>} />
      <Route path="/book/:id" element={<DetailsBook/>} />
  </Routes>
  );
};

export default App;
