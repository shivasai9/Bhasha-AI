import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageSelector />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/article/:id/:title/:difficulty" element={<ArticleView />} />
        <Route path="*" element={<LanguageSelector />} />
      </Routes>
    </Router>
  );
}

export default App;