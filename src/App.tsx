import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import {  } from 'react-router-dom';
import { HomePage } from './pages/HomePage';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* Add a match all and redirect to login */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
    </Router>
  );
}

export default App;
