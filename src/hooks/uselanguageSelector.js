import { useNavigate } from "react-router-dom";
import { upsertRecord } from "../lib/dbUtils";
import { STORES } from "../lib/constants";

const useLanguageSelector = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = async (langCode) => {
    try {
      await upsertRecord(STORES.SETTINGS, null, {
        langName: langCode,
      });
      navigate("/articles");
    } catch (error) {
      console.error("Error updating language:", error);
    }
  };

  return { handleLanguageSelect };
};

export default useLanguageSelector;
