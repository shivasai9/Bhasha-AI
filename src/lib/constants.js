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
    name: "Daily Life & Culture",
    description: "Everyday situations, customs, and cultural practices",
    icon: "🌟"
  },
  {
    name: "Entertainment",
    description: "Movies, music, shows, and popular media",
    icon: "🎬"
  },
  {
    name: "Food & Cooking",
    description: "Recipes, dining, and culinary traditions",
    icon: "🍳"
  },
  {
    name: "Travel & Adventure",
    description: "Destinations, tips, and travel experiences",
    icon: "✈️"
  },
  {
    name: "Arts & Literature",
    description: "Books, art, music, and creative expression",
    icon: "🎨"
  },
  {
    name: "Technology",
    description: "Digital trends, apps, and innovation",
    icon: "💻"
  },
  {
    name: "Nature & Environment",
    description: "Wildlife, ecology, and natural world",
    icon: "🌿"
  },
  {
    name: "Sports & Fitness",
    description: "Athletics, exercise, and wellness activities",
    icon: "⚽"
  }
];
