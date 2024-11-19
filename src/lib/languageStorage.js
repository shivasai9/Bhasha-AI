const LANGUAGE_KEY = 'website_language';

export const saveLanguage = (language) => {
  const lowerCasedLanguage = language.toLowerCase();
  localStorage.setItem(LANGUAGE_KEY, lowerCasedLanguage);
};

export const getLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY) || 'english';
};

const TARGET_LANGUAGE_KEY = 'learning_language';
const TOPICS_KEY = 'selected_topics';

export const saveTargetLanguage = (language) => {
  const lowerCasedLanguage = language.toLowerCase();
  localStorage.setItem(TARGET_LANGUAGE_KEY, lowerCasedLanguage);
};

export const getTargetLanguage = () => {
  return localStorage.getItem(TARGET_LANGUAGE_KEY) || 'spanish';
};

export const saveTopics = (topics) => {
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
};

export const getTopics = () => {
  return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
};