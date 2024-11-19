import { useState, useEffect } from "react";
import { getLearningLanguage } from "../lib/languageStorage";
import { aiWrapper } from "../lib/ai";

export function useSummaryWriter(article) {
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState({ errors: [], corrected: "" });
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    const currentLanguage = getLearningLanguage();
    setIsEnglish(currentLanguage === "english");
  }, []);
  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calling Correction Summary Prompt
      console.log(article);
      const parsedSummary =await aiWrapper.correctSummary(article.article.title, summary);
      setFeedback({
        errors: [
          {
            original: parsedSummary.Errors,
            correction: parsedSummary.Suggestions,
          },
        ],
        corrected: parsedSummary["Corrected Summary"],
      });
      setShowFeedback(true);
    } catch (error) {
      console.error("Error analyzing summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
  };

  return {
    summary,
    feedback,
    loading,
    showFeedback,
    handleSummaryChange,
    handleSubmit,
    closeFeedback,
    isEnglish,
  };
}
