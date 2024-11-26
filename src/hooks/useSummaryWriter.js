import { useState, useEffect } from "react";
import { getLearningLanguage } from "../lib/languageStorage";
import { articleSummaryService } from "../lib/services/articleSummary.service";

export function useSummaryWriter({ article, articleContent }) {
  const [summary, setSummary] = useState("");
  const [feedback, setFeedback] = useState([]);
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

  const processFeedback = (feedbackArray) => {
    return feedbackArray.map((item, index) => ({
      id: index,
      originalSentence: item.originalSentence || "",
      identifiedIssues: item.identifiedIssues || [],
      correctedSentence: item.correctedSentence || "",
      hasIssues: (item.identifiedIssues || []).length > 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!articleContent) {
        throw new Error("Article content is required");
      }

      await articleSummaryService.initializeWithArticle(articleContent);
      const feedbackResponse = await articleSummaryService.correctSummary(summary);
      const processedFeedback = processFeedback(feedbackResponse);

      setFeedback(processedFeedback);
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
    isEnglish
  };
}
