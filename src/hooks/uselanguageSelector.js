import { useNavigate } from "react-router-dom";

const useLanguageSelector = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (langCode) => {
    localStorage.setItem("selectedLanguage", langCode);
    navigate("/articles");
  };

  return { handleLanguageSelect };
};

export default useLanguageSelector;
