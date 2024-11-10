const LANGUAGE_KEY = 'basha_selected_language';

export const saveLanguage = (language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'english'; // Default to english
};