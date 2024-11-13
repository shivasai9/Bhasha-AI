const LANGUAGE_KEY = 'selected_basha';

export const saveLanguage = (language) => {
  const lowerCasedLanguage = language.toLowerCase();
  localStorage.setItem(LANGUAGE_KEY, lowerCasedLanguage);
};

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'english'; // Default to english
};