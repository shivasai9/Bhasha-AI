import { useState, useEffect } from 'react';
import { generateArticles } from '../lib/articleGenerator';
import { getArticlesByLanguage, getAllRecords, upsertRecord } from '../lib/dbUtils';
import { STORES } from '../lib/constants';
import { aiWrapper } from '../lib/ai';
import { getLanguage } from '../lib/languageStorage';

// Add a function to generate unique IDs
const generateUniqueId = () => `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCount, setGeneratingCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isCustomArticle, setIsCustomArticle] = useState(false);
  const [language, setLanguage] = useState(getLanguage()); // Default to 'en'

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = getLanguage();
        setLanguage(savedLanguage);
      } catch (error) {
        console.error('Error loading language setting:', error);
        setLanguage('english'); // Fallback to English on error
      }
    };
    loadLanguage();
  }, []);

  const loadArticles = async () => {
    setInitialLoading(true);
    setLoading(true);
    try {
      setArticles([]);
      let availableArticles = await getArticlesByLanguage(language);
      
      // Show existing articles first
      if (availableArticles.length > 0) {
        setArticles(availableArticles);
      }
      
      if (availableArticles.length < 3) {
        const remaining = 3 - availableArticles.length;
        setGeneratingCount(remaining);
        
        // Generate one article at a time
        for (let i = 0; i < remaining; i++) {
          const newArticle = await generateArticles(language, null, 1, (articles) => {
            if (articles.length > 0) {
              setArticles(prev => [...prev, articles[0]]);
              setGeneratingCount(prev => prev - 1);
            }
          });
          
          // Add delay between generations
          if (i < remaining - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setGeneratingCount(0);
    }
  };

  const generateCustomArticle = async (topic) => {
    setLoading(true);
    setGeneratingCount(1);
    setIsCustomArticle(true);
    try {
      const updatedArticles = await generateArticles(language, topic, 1);
      if (updatedArticles.length > 0) {
        setArticles(updatedArticles);
        return updatedArticles[0];
      }
      return null;
    } catch (error) {
      console.error('Error generating custom article:', error);
      return null;
    } finally {
      setLoading(false);
      setGeneratingCount(0);
      setIsCustomArticle(false);
    }
  };

  const generateMoreArticles = async () => {
    if (loading || generatingCount > 0) return;
    
    setLoading(true);
    setGeneratingCount(3);
    try {
      // Generate one article at a time
      for (let i = 0; i < 3; i++) {
        const newArticle = await generateArticles(language, null, 1, (articles) => {
          if (articles.length > 0) {
            setArticles(prev => [...prev, articles[0]]);
            setGeneratingCount(prev => prev - 1);
          }
        });
        
        // Add delay between generations
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    } catch (error) {
      console.error('Error generating more articles:', error);
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  // Update useEffect to depend on language state
  useEffect(() => {
    if (language) {
      loadArticles();
    }
  }, [language]); // Re-run when language changes

  return {
    articles,
    loading,
    initialLoading, // Add this to return
    generatingCount,
    generateCustomArticle,
    generateMoreArticles,
    isCustomArticle,  // Add this to return value
    language, // Add language to the return value
  };
}