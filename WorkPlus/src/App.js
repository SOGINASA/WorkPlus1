// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../src/components/components1/Layout';
import HomePage from './pages/Home';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Пока добавим только главную страницу */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;