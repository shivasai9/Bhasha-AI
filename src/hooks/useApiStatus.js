//@ts-nocheck
import { useState, useEffect } from "react";

export const useApiStatus = () => {
  const [translationStatus, setTranslationStatus] = useState("Checking...");
  const [promptsStatus, setPromptsStatus] = useState("Checking...");
  const [summarizationStatus, setSummarizationStatus] = useState("Checking...");

  useEffect(() => {
    const checkTranslationApi = async () => {
      try {
        const canTranslate = await translation.canTranslate({
          sourceLanguage: "en",
          targetLanguage: "es",
        });
        setTranslationStatus(
          canTranslate === "readily" ? "Available" : "Not Available"
        );
      } catch (error) {
        setTranslationStatus("Not Available");
      }
    };

    const checkPromptsApi = async () => {
      try {
        const capabilities = await ai.languageModel.capabilities();
        setPromptsStatus(
          capabilities.available === "readily" ? "Available" : "Not Available"
        );
      } catch (error) {
        setPromptsStatus("Not Available");
      }
    };

    const checkSummarizationApi = async () => {
      try {
        const capabilities = await ai.summarizer.capabilities();
        setSummarizationStatus(
          capabilities.available === "readily" ? "Available" : "Not Available"
        );
      } catch (error) {
        setSummarizationStatus("Not Available");
      }
    };

    checkTranslationApi();
    checkPromptsApi();
    checkSummarizationApi();
  }, []);

  return {
    translationStatus,
    promptsStatus,
    summarizationStatus,
  };
};