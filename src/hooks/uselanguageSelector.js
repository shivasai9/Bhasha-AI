import { useState, useEffect } from 'react';
import { saveInterfaceLanguage, saveLearningLanguage, saveTopics, getInterfaceLanguage, getLearningLanguage } from "../lib/languageStorage";

const useLanguageSelector = (onLanguageChange = null) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');
  const [selectedWebsiteLang, setSelectedWebsiteLang] = useState('');
  const [selectedLearningLang, setSelectedLearningLang] = useState('');

  useEffect(() => {
    setSelectedWebsiteLang(getInterfaceLanguage());
    setSelectedLearningLang(getLearningLanguage());
  }, []);

  const handleWebsiteLanguage = (langCode) => {
    setDirection('forward');
    setSelectedWebsiteLang(langCode.toLowerCase());
    saveInterfaceLanguage(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode.toLowerCase());
    }
    setStep(2);
  };

  const handleTargetLanguage = (langCode) => {
    setDirection('forward');
    setSelectedLearningLang(langCode.toLowerCase());
    saveLearningLanguage(langCode);
    setStep(3);
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('back');
      setStep(step - 1);
    }
  };

  const handleStepClick = (targetStep) => {
    if (targetStep < step) {
      setDirection('back');
      setStep(targetStep);
    }
  };

  return { 
    handleWebsiteLanguage, 
    handleTargetLanguage, 
    handleTopicsSelect: saveTopics,
    step,
    handleBack,
    handleStepClick,
    direction,
    selectedWebsiteLang,
    selectedLearningLang,
  };
};

export default useLanguageSelector;
