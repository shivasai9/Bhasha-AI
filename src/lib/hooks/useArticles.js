import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from '@lukeed/uuid';
import { aiWrapper } from '../ai';
import { getArticlesByLanguage, saveArticle } from '../dbUtils';

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCount, setGeneratingCount] = useState(0);
  const language = localStorage.getItem('selectedLanguage') || 'en';

  const generateAndSaveArticle = async () => {
    try {
      const articleData = await aiWrapper.generateArticle();
      const article = {
        articleID: uuidv4(), // Changed from id to articleID to match other code
        ...articleData,
        language,
        timestamp: Date.now(),
        isSaved: false // Added to match article structure
      };
      
      await saveArticle(article);
      setArticles(prev => [...prev, article]);
      return article;
    } catch (error) {
      console.error('Failed to generate article:', error);
      throw error;
    }
  };

  const generateCustomArticle = async (topic) => {
    setLoading(true);
    try {
      await aiWrapper.initialize();
      const articleData = await aiWrapper.generateArticle();
      const article = {
        articleID: uuidv4(),
        ...articleData,
        title: `${topic}: ${articleData.title}`,
        language,
        timestamp: Date.now(),
        isSaved: false
      };
      
      await saveArticle(article);
      setArticles(prev => [...prev, article]);
      return article;
    } catch (error) {
      console.error('Failed to generate custom article:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Load existing articles from database
      const savedArticles = await getArticlesByLanguage(language);
      setArticles(savedArticles);

      // If we need more articles, generate them
      if (savedArticles.length < 3) {
        setGeneratingCount(3 - savedArticles.length);
        await aiWrapper.initialize();
        
        for (let i = savedArticles.length; i < 3; i++) {
          await generateAndSaveArticle();
          setGeneratingCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  const generateMoreArticles = async () => {
    if (loading || generatingCount > 0) return;
    
    setGeneratingCount(3);
    try {
      await aiWrapper.initialize();
      
      for (let i = 0; i < 3; i++) {
        try {
          const articleData = await aiWrapper.generateArticle();
          const article = {
            articleID: uuidv4(),
            ...articleData,
            language,
            timestamp: Date.now(),
            isSaved: false
          };
          
          await saveArticle(article);
          setArticles(prev => [...prev, article]); // Update articles immediately
          setGeneratingCount(prev => Math.max(0, prev - 1));
          
          // Add delay between generations
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate article ${i + 1}:`, error);
          setGeneratingCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error generating more articles:', error);
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  useEffect(() => {
    loadArticles();
    return () => aiWrapper.destroy();
  }, [language]);

  return {
    articles,
    loading,
    initialLoading: loading && articles.length === 0,
    generatingCount,
    generateMoreArticles,
    generateCustomArticle // Added this to return
  };
}