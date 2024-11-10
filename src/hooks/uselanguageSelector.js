import { useNavigate } from "react-router-dom";
import { saveLanguage } from "../lib/languageStorage";

const useLanguageSelector = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = async (langCode) => {
    try {
      saveLanguage(langCode);
      navigate("/articles");
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return { handleLanguageSelect };
};

export default useLanguageSelector;
