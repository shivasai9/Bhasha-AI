import { useState, useEffect } from 'react';
import { getArticleById, saveWord, getArticleContent } from '../lib/dbUtils';
import { useParams, useNavigate } from 'react-router-dom';
import { generateArticleContent } from '../lib/articleGenerator';

export function useArticleView() {
  const [article, setArticle] = useState(null);
  const [articleContent, setArticleContent] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [articleDataLoading, setArticleDataLoading] = useState(true);
  const { id: articleId, difficulty = 'beginner', title } = useParams();
  const [activeTab, setActiveTab] = useState('read');
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticleAndContent = async () => {
      try {
        const articleData = await getArticleById(articleId);
        setArticle(articleData);
        setArticleDataLoading(false);

        const articleContentData = await getArticleContent(articleId, difficulty);
        const content = articleContentData?.content || "";
        if (content) {
          setArticleContent(content);
          setContentLoading(false);
        } else {
          await generateArticleContent(
            articleId,
            difficulty,
            articleData.title,
            articleData.summary,
            true,
            (partialContent) => {
              setArticleContent(partialContent);
              if(contentLoading) {
                setContentLoading(false);
              }
            }
          );
        }
      } catch (error) {
        console.error('Error loading article or content:', error);
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

  console.log("===content====", articleContent);

  return {
    article,
    articleContent,
    contentLoading,
    selectedWord,
    isWordModalOpen,
    activeTab,
    articleDataLoading,
    setActiveTab,
    handleWordClick,
    closeWordModal,
    handleSaveWord,
    navigate,
  };
}