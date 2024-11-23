const LANGUAGE_KEY = 'website_language';
const TARGET_LANGUAGE_KEY = 'learning_language';
const TOPICS_KEY = 'selected_topics';
const GENERATED_SUBTOPICS_KEY = 'generated_subtopics';
const RANDOM_GENERATED_TOPICS_KEY = 'random_generated_topics';

export const saveInterfaceLanguage = (language) => {
  const lowerCasedLanguage = language.toLowerCase();
  localStorage.setItem(LANGUAGE_KEY, lowerCasedLanguage);
};

export const getInterfaceLanguage = () => {
  return localStorage.getItem(LANGUAGE_KEY);
};

export const saveLearningLanguage = (language) => {
  const lowerCasedLanguage = language.toLowerCase();
  localStorage.setItem(TARGET_LANGUAGE_KEY, lowerCasedLanguage);
};

export const getLearningLanguage = () => {
  return localStorage.getItem(TARGET_LANGUAGE_KEY);
};

export const saveTopics = (topics) => {
  localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
};

export const getTopics = () => {
  return JSON.parse(localStorage.getItem(TOPICS_KEY) || '[]');
};

export const saveGeneratedSubTopics = (subtopics) => {
  localStorage.setItem(GENERATED_SUBTOPICS_KEY, JSON.stringify(subtopics));
};

export const getGeneratedSubTopics = () => {
  return JSON.parse(localStorage.getItem(GENERATED_SUBTOPICS_KEY) || '[]');
};

export const saveRandomGeneratedTopics = (topics) => {
  localStorage.setItem(RANDOM_GENERATED_TOPICS_KEY, JSON.stringify(topics));
};

export const getRandomGeneratedTopics = () => {
  return JSON.parse(localStorage.getItem(RANDOM_GENERATED_TOPICS_KEY) || '[]');
};