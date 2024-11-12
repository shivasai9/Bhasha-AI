const LANGUAGE_KEY = 'selected_basha';

export const saveLanguage = (language) => {
  localStorage.setItem(LANGUAGE_KEY, language);
};

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'english'; // Default to english
};