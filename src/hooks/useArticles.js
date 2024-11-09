import { useState, useEffect } from 'react';
import { generateArticles } from '../lib/articleGenerator';
import { saveArticle } from '../lib/dbUtils';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = localStorage.getItem('selectedLanguage') || 'en';

  const loadArticles = async () => {
    setLoading(true);
    try {
      const generatedArticles = await generateArticles(language);
      setArticles(generatedArticles);
      await Promise.all(generatedArticles.map(article => saveArticle(article)));
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomArticle = async (topic) => {
    setLoading(true);
    try {
      const newArticle = await generateArticles(language, topic, 1);
      await saveArticle(newArticle[0]);
      return newArticle[0];
    } catch (error) {
      console.error('Error generating custom article:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    loading,
    generateCustomArticle
  };
}