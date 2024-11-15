import { useState, useEffect } from 'react';
import { getArticleById, saveWord } from '../lib/dbUtils';
import { useParams } from 'react-router-dom';

export function useArticleView() {
  const [article, setArticle] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id: articleId, difficulty, title } = useParams();
  const [activeTab, setActiveTab] = useState('read');

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const articleData = await getArticleById(articleId);
        // Add the text content from the article
        setArticle({
          ...articleData,
          content: articleData.text || "No content available"
        });
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleId, difficulty]);

  const handleWordClick = (word) => {
    setSelectedWord(word);
    setIsWordModalOpen(true);
  };

  const closeWordModal = () => {
    setIsWordModalOpen(false);
    setSelectedWord(null);
  };

  const handleSaveWord = async (word, details) => {
    try {
      await saveWord({ word, details });
      closeWordModal();
    } catch (error) {
      console.error('Error saving word:', error);
    }
  };

  return {
    article,
    selectedWord,
    isWordModalOpen,
    loading,
    activeTab,
    setActiveTab,
    handleWordClick,
    closeWordModal,
    handleSaveWord,
  };
}