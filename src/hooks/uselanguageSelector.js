import { useState } from 'react';
import { saveInterfaceLanguage, saveLearningLanguage, saveTopics } from "../lib/languageStorage";

const useLanguageSelector = (onLanguageChange = null) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState('forward');

  const handleWebsiteLanguage = (langCode) => {
    setDirection('forward');
    saveInterfaceLanguage(langCode);
    if (onLanguageChange) {
      onLanguageChange(langCode.toLowerCase());
    }
    setStep(2);
  };

  const handleTargetLanguage = (langCode) => {
    setDirection('forward');
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
  };
};

export default useLanguageSelector;
