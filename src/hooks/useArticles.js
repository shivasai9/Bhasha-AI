import { useState, useEffect } from 'react';
import { generateArticles } from '../lib/articleGenerator';
import { getArticlesByLanguage } from '../lib/dbUtils';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCount, setGeneratingCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true); // Add this state
  const language = localStorage.getItem('selectedLanguage') || 'en';

  const loadArticles = async () => {
    setInitialLoading(true); // Set initial loading
    setLoading(true);
    try {
      // Load existing articles first
      const existingArticles = await getArticlesByLanguage(language);
      setArticles(existingArticles);
      setInitialLoading(false); // Clear initial loading after first fetch
      
      // Always try to generate articles if we have less than 3
      if (existingArticles.length < 3) {
        const needed = 3 - existingArticles.length;
        setGeneratingCount(needed);
        
        await generateArticles(language, null, 3, (updatedArticles) => {
          if (updatedArticles.length > 0) {
            setArticles(updatedArticles);
            setGeneratingCount(3 - updatedArticles.length);
          }
        });
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]); // Set empty array on error
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  const generateCustomArticle = async (topic) => {
    setLoading(true);
    try {
      const newArticle = await generateArticles(language, topic, 1);
      setArticles(prev => [...prev, ...newArticle]);
      return newArticle[0];
    } catch (error) {
      console.error('Error generating custom article:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateMoreArticles = async () => {
    if (loading || generatingCount > 0) return;
    
    setLoading(true);
    setGeneratingCount(3);
    try {
      await generateArticles(language, null, 3, (updatedArticles) => {
        setArticles(prev => [...prev, ...updatedArticles.slice(prev.length)]);
        setGeneratingCount(3 - updatedArticles.length);
      });
    } catch (error) {
      console.error('Error generating more articles:', error);
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [language]);

  return {
    articles,
    loading,
    initialLoading, // Add this to return
    generatingCount,
    generateCustomArticle
  };
}