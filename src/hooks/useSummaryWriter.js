import { useState, useEffect } from "react";
import { getLearningLanguage } from "../lib/languageStorage";

export function useSummaryWriter() {
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
      // In a real implementation, this would use Chrome's AI API
      setFeedback({
        errors: [
          {
            original: "Sample error sentence",
            correction: "Corrected sample sentence",
          },
        ],
        corrected: "Sample corrected summary",
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
