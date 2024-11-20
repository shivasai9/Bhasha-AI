export const DB_NAME = "bashaAi";
export const DB_VERSION = 1;

// Store Names
export const STORES = {
  WORDS: "words",
  ARTICLES: "articles",
  ARTICLES_CONTENT: "articlesContent",
  QUIZ: "quiz",
  SUMMARY_CHALLENGE: "summaryChallenge",
};

export const LANGUAGE_CODES = {
  english: "en",
  spanish: "es",
  french: "fr",
};

export const WIKI_IMAGE_URL =
  "https://www.levelify.me/api/getwikimediaimages?srsearch=";

export const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
];

export const IMAGE_EXTENTIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "webp",
  "bmp",
  "tiff",
];

export const SPEECH_VOICE_CONFIG = {
  english: {
    lang: "en-US",
    voicePattern: /^en/i,
  },
  spanish: {
    lang: "es-ES",
    voicePattern: /^es/i,
  },
  french: {
    lang: "fr-FR",
    voicePattern: /^fr/i,
  },
};

export const TOPICS = [
  {
    id: "daily-life",
    name: "Daily Life & Culture",
    description: "Everyday situations, customs, and cultural practices",
    icon: "🌟"
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, music, shows, and popular media",
    icon: "🎬"
  },
  {
    id: "food",
    name: "Food & Cooking",
    description: "Recipes, dining, and culinary traditions",
    icon: "🍳"
  },
  {
    id: "travel",
    name: "Travel & Adventure",
    description: "Destinations, tips, and travel experiences",
    icon: "✈️"
  },
  {
    id: "arts",
    name: "Arts & Literature",
    description: "Books, art, music, and creative expression",
    icon: "🎨"
  },
  {
    id: "technology",
    name: "Technology",
    description: "Digital trends, apps, and innovation",
    icon: "💻"
  },
  {
    id: "nature",
    name: "Nature & Environment",
    description: "Wildlife, ecology, and natural world",
    icon: "🌿"
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Athletics, exercise, and wellness activities",
    icon: "⚽"
  }
];

export const BRAND_NAME = {
  "english": "LanguageAI",
  "spanish": "IdiomaAI",
  "french": "LangueAI",
  "original": "BashaAI"
}

export const LANGUAGE_CODES_TO_NAME = {
  en: "english",
  es: "spanish",
  fr: "french",
};