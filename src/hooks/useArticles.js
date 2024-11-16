import { useState, useEffect } from "react";
import { generateArticle, generateArticles } from "../lib/articleGenerator";
import { getArticlesByLanguage } from "../lib/dbUtils";
import { getLanguage } from "../lib/languageStorage";
import { translateAndSaveArticle } from "../lib/utils";

export function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCount, setGeneratingCount] = useState(0);
  const [isCustomArticle, setIsCustomArticle] = useState(false);
  const [language, setLanguage] = useState(getLanguage());
  console.log("==generated articles==", generatingCount);
  const loadArticles = async () => {
    setLoading(true);
    try {
      const existingArticles = await getArticlesByLanguage(language);
      let englishArticles = existingArticles;
      if (language.toLowerCase() !== "english") {
        englishArticles = await getArticlesByLanguage("english");
      }
      setArticles(existingArticles);

      if (
        language.toLowerCase() !== "english" &&
        englishArticles.length > 0 &&
        existingArticles.length === 0
      ) {
        setGeneratingCount(englishArticles.length);
        for (let i = 0; i < englishArticles.length; i++) {
          const translatedArticle = await translateAndSaveArticle(
            englishArticles[i],
            language
          );
          setArticles((prev) => [...prev, translatedArticle]); // Add translations one by one
          setGeneratingCount(englishArticles.length - i - 1);
        }
        return;
      }

      if (
        language.toLowerCase() !== "english" &&
        englishArticles.length > 0 &&
        existingArticles.length > 0 &&
        existingArticles.length < englishArticles.length
      ) {
        const missedArticles = englishArticles.filter(
          (article) =>
            !existingArticles.find(
              (a) => a.originalArticleId === article.articleID
            )
        );
        if (missedArticles.length > 0) {
          setGeneratingCount(missedArticles.length);
          for (let i = 0; i < missedArticles.length; i++) {
            const translatedArticle = await translateAndSaveArticle(
              missedArticles[i],
              language
            );
            setArticles((prev) => [...prev, translatedArticle]); // Add each article progressively
            setGeneratingCount(missedArticles.length - i - 1);
          }
        }
        return;
      }

      // Always try to generate articles if we have less than 3
      if (existingArticles.length < 3) {
        const needed = 3 - existingArticles.length;
        setGeneratingCount(needed);

        await generateArticles(3, (updatedArticles) => {
          if (updatedArticles.length > 0) {
            setArticles((prev) => [...prev, ...updatedArticles.slice(-1)]);
            setGeneratingCount(needed - updatedArticles.length);
          }
        });
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      // TODO: Show Try Again Button -> It should refresh the page
      setArticles([]);
      setGeneratingCount(0);
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
      const customArticleData = await generateArticle(topic);
      setArticles((prev) => [customArticleData, ...prev]);
    } catch (error) {
      console.error("Error generating custom article:", error);
      throw error;
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
      const targetCount = articles.length + 3;
      await generateArticles(targetCount, (updatedArticles) => {
        setArticles((prev) => [...prev, ...updatedArticles.slice(-1)]);
        setGeneratingCount(3 - updatedArticles.length);
      });
    } catch (error) {
      console.error("Error generating more articles:", error);
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
    generatingCount,
    generateCustomArticle,
    generateMoreArticles,
    isCustomArticle,
    setLanguage,
    language,
  };
}
