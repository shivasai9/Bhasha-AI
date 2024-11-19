import { useState, useEffect } from "react";
import {
  getArticleById,
  saveWord,
  getArticleContent,
  saveArticleContent,
} from "../lib/dbUtils";
import { useParams, useNavigate } from "react-router-dom";
import { generateArticleContent } from "../lib/articleGenerator";
import { getLearningLanguage } from "../lib/languageStorage";
import { translateContent } from "../lib/translation.service";

export function useArticleView() {
  const [article, setArticle] = useState(null);
  const [articleContent, setArticleContent] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [articleDataLoading, setArticleDataLoading] = useState(true);
  const { id: articleId, difficulty = "easy", title } = useParams();
  const [activeTab, setActiveTab] = useState("read");
  const [language, setLanguage] = useState(getLearningLanguage());
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  const handleDifficultyChange = (newDifficulty) => {
    setSelectedDifficulty(newDifficulty);
    const newUrl = `/article/${articleId}/${title}/${newDifficulty}`;
    window.history.pushState({}, '', newUrl);
    setContentLoading(true);
  };

  const loadArticleAndContent = async () => {
    try {
      const articleData = await getArticleById(articleId);
      setArticle(articleData);
      setArticleDataLoading(false);

      let articleContentData = await getArticleContent(
        articleId,
        selectedDifficulty,
        language
      );
      let content = articleContentData?.content;

      if (content) {
        setArticleContent(content);
        setContentLoading(false);
        return;
      }

      const englishArticleId = articleData.originalArticleId || articleId;

      const englishArticleContentData = await getArticleContent(
        englishArticleId,
        selectedDifficulty,
        "english"
      );
      const englishContent = englishArticleContentData?.content;

      if (englishContent) {
        // non english language selected if english content exists case
        const translatedContent = await translateContent(
          englishContent,
          "english",
          language
        );
        setArticleContent(translatedContent);
        setContentLoading(false);
        const contentToSave = {
          articleID: articleId,
          content: translatedContent,
          level: selectedDifficulty,
          language,
          timestamp: Date.now(),
        }
        await saveArticleContent(contentToSave);
      } else {
        // Generate content if English content doesn't exist
        const englishArticleData = await getArticleById(englishArticleId);
        await generateArticleContent(
          englishArticleId,
          selectedDifficulty,
          englishArticleData.title,
          englishArticleData.summary,
          true,
          async (partialContent) => {
            const contentToSet =
              language === "english"
                ? partialContent
                : await translateContent(partialContent, "english", language);
            setArticleContent(contentToSet);
            if (contentLoading) {
              setContentLoading(false);
            }
            if (language !== "english") {
              const contentToSave = {
                articleID: articleId,
                content: contentToSet,
                level: selectedDifficulty,
                language,
                timestamp: Date.now(),
              }
              await saveArticleContent(contentToSave);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error loading article or content:", error);
    }
  };

  useEffect(() => {
    loadArticleAndContent();
  }, [articleId, selectedDifficulty]);

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
      console.error("Error saving word:", error);
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
    selectedDifficulty,
    handleDifficultyChange,
  };
}
