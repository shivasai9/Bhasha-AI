import { useState, useEffect } from 'react';
import { getArticleById, saveWord, getArticleContent } from '../lib/dbUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { generateArticleContent } from '../lib/articleGenerator';

export function useArticleView() {
  const [article, setArticle] = useState(null);
  const [articleContent, setArticleContent] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const { id: articleId, difficulty = 'beginner', title } = useParams();
  const [activeTab, setActiveTab] = useState('read');
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticleAndContent = async () => {
      try {
        const articleData = await getArticleById(articleId);
        setArticle(articleData);

        const content = await getArticleContent(articleId, difficulty);
        if (content) {
          setArticleContent(content.content);
        } else {
          const generatedContent = await generateArticleContent(
            articleId,
            difficulty,
            articleData.title,
            articleData.summary
          );
          setArticleContent(generatedContent);
        }
      } catch (error) {
        console.error('Error loading article or content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    loadArticleAndContent();
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
    articleContent,
    contentLoading,
    selectedWord,
    isWordModalOpen,
    activeTab,
    setActiveTab,
    handleWordClick,
    closeWordModal,
    handleSaveWord,
    navigate,
  };
}