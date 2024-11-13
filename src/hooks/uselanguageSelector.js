import { useNavigate } from "react-router-dom";
import { saveLanguage } from "../lib/languageStorage";

const useLanguageSelector = (onLanguageChange = null) => {
  const navigate = useNavigate();

  const handleLanguageSelect = async (langCode) => {
    try {
      saveLanguage(langCode);
      if (onLanguageChange) {
        onLanguageChange(langCode);
      } else {
        navigate("/articles");
      }
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return { handleLanguageSelect };
};

export default useLanguageSelector;
