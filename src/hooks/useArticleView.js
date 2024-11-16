import { useState, useEffect } from "react";
import {
  getArticleById,
  saveWord,
  getArticleContent,
  saveArticleContent,
} from "../lib/dbUtils";
import { useParams, useNavigate } from "react-router-dom";
import { generateArticleContent } from "../lib/articleGenerator";
import { getLanguage } from "../lib/languageStorage";
import { translateContent } from "../lib/translation.service";

export function useArticleView() {
  const [article, setArticle] = useState(null);
  const [articleContent, setArticleContent] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [articleDataLoading, setArticleDataLoading] = useState(true);
  const { id: articleId, difficulty = "beginner", title } = useParams();
  const [activeTab, setActiveTab] = useState("read");
  const [language, setLanguage] = useState(getLanguage());
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticleAndContent = async () => {
      try {
        const articleData = await getArticleById(articleId);
        setArticle(articleData);
        setArticleDataLoading(false);

        let articleContentData = await getArticleContent(
          articleId,
          difficulty,
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
          difficulty,
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
            level: difficulty,
            language,
            timestamp: Date.now(),
          }
          await saveArticleContent(contentToSave);
        } else {
          // Generate content if English content doesn't exist
          const englishArticleData = await getArticleById(englishArticleId);
          await generateArticleContent(
            englishArticleId,
            difficulty,
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
                  level: difficulty,
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
  };
}
