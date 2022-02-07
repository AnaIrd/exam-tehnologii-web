import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom'
import VirtualShelfList from "./components/VirtualShelfList";
import BookList from "./components/BookList"

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path='/' element={<VirtualShelfList />} />
          <Route path="/virtualShelves/:virtualShelfId/books" element={<BookList />} />
        </Routes>
      </HashRouter>
  );
}

export default App;
