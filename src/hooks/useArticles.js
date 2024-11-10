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
    setInitialLoading(true); // Set initial loading
    setLoading(true);
    try {
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
      const targetCount = articles.length + 3; // Calculate target count dynamically
      await generateArticles(language, null, targetCount, (updatedArticles) => {
        setArticles(prev => [...prev, ...updatedArticles.slice(prev.length)]);
        setGeneratingCount(targetCount - updatedArticles.length);
      });
    } catch (error) {
      console.error('Error generating more articles:', error);
    } finally {
      setLoading(false);
      setGeneratingCount(0);
    }
  };

  // Update useEffect to depend on language state
  useEffect(() => {
    loadArticles();
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