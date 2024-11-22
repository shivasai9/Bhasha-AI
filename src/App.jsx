import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSelector from './components/LanguageSelector';
import ArticleList from './components/ArticleList';
import ArticleView from './components/ArticleView';
import Settings from './components/Settings';
import SavedWords from './components/SavedWords';
import ApiStatus from './components/ApiStatus.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LanguageSelector />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/article/:id/:title/:difficulty" element={<ArticleView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/saved-words" element={<SavedWords />} />
        <Route path="/api-status" element={<ApiStatus />} />
        <Route path="*" element={<LanguageSelector />} />
      </Routes>
    </Router>
  );
}

export default App;