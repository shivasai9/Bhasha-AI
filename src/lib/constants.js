export const DB_NAME = "BhashaAi";
export const DB_VERSION = 1;

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
    defaultVoice: "Google US English",
  },
  spanish: {
    lang: "es-ES",
    voicePattern: /^es/i,
    defaultVoice: "Google Español",
  },
  french: {
    lang: "fr-FR",
    voicePattern: /^fr/i,
    defaultVoice: "Google Français",
  },
};

export const TOPICS = [
  {
    id: "daily-life",
    name: "Daily Life & Culture",
    description: "Everyday situations, customs, and cultural practices",
    icon: "🌟",
    subTopics: [
      "Morning routines around the world",
      "Cultural significance of festivals",
      "Traditional clothing and attire",
      "Family structures in different societies",
      "Work-life balance practices",
      "Social etiquette and manners",
      "Housing and architectural styles",
      "Education systems globally",
      "Rituals and ceremonies",
      "Language and dialects diversity",
      "Wedding traditions across cultures",
      "Dietary habits and meal times",
      "Parenting styles in various countries",
      "Transportation methods in urban and rural areas",
      "Role of elders in different societies",
      "Leisure activities and hobbies",
      "Public holidays and their origins",
      "Shopping customs and markets"
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description: "Movies, music, shows, and popular media",
    icon: "🎬",
    subTopics: [
      "The evolution of streaming services",
      "Impact of social media influencers",
      "Behind the scenes of filmmaking",
      "Global music trends",
      "The rise of virtual concerts",
      "Animation and its global impact",
      "Stand-up comedy around the world",
      "Esports and competitive gaming",
      "The history of theater",
      "Documentary storytelling techniques",
      "The impact of reality TV shows",
      "Podcasts and their growing popularity",
      "Role of censorship in entertainment",
      "Evolution of video game consoles",
      "Awards ceremonies and their significance",
      "Influence of entertainment on fashion",
      "Nostalgia in entertainment (e.g., reboots, remakes)",
      "Cultural representation in movies and TV",
      "Soundtrack composition and its effects",
      "Celebrity culture and paparazzi",
    ],
  },
  {
    id: "food",
    name: "Food & Cooking",
    description: "Recipes, dining, and culinary traditions",
    icon: "🍳",
    subTopics: [
      "Street foods from around the world",
      "Plant-based diet recipes",
      "Baking techniques for beginners",
      "The art of sushi making",
      "Spices and their health benefits",
      "Wine pairing basics",
      "Traditional holiday meals",
      "Fermentation in cooking",
      "Global tea cultures",
      "Chocolate: from bean to bar",
      "Regional cheese varieties",
      "The science of cooking (molecular gastronomy)",
      "Gluten-free cooking options",
      "Farm-to-table movement",
      "Culinary uses of edible flowers",
      "Preserving and canning techniques",
      "Coffee brewing methods",
      "Influence of immigration on cuisine",
      "Cooking with superfoods",
      "History of bread-making",
    ],
  },
  {
    id: "travel",
    name: "Travel & Adventure",
    description: "Destinations, tips, and travel experiences",
    icon: "✈️",
    subTopics: [
      "Backpacking through Europe",
      "Exploring ancient ruins",
      "Solo travel tips",
      "Cultural immersion experiences",
      "Adventure sports destinations",
      "Sustainable tourism practices",
      "World's most scenic train rides",
      "Island hopping itineraries",
      "Historical city guides",
      "Wildlife safaris in Africa",
      "Budget travel hacks",
      "Volunteering abroad experiences",
      "Road trips across continents",
      "Navigating language barriers",
      "Culinary travel: food tours",
      "Festivals worth traveling for",
      "Staying safe while traveling",
      "Luxury travel destinations",
      "Traveling with pets",
      "Space tourism prospects",
    ],
  },
  {
    id: "arts",
    name: "Arts & Literature",
    description: "Books, art, music, and creative expression",
    icon: "🎨",
    subTopics: [
      "Impressionist art movement",
      "Modern poetry analysis",
      "Classical composers and their works",
      "Graphic novels significance",
      "Sculpture techniques",
      "Photography in the digital age",
      "Street art and murals",
      "Folklore and myth in literature",
      "Jazz music evolution",
      "Digital illustration tutorials",
      "Renaissance art history",
      "Contemporary dance forms",
      "Literary criticism methods",
      "Art therapy benefits",
      "Evolution of typography",
      "The role of art in activism",
      "Collecting and curating art",
      "Biography of influential authors",
      "Film adaptations of books",
      "The future of publishing industry",
    ],
  },
  {
    id: "technology",
    name: "Technology",
    description: "Digital trends, apps, and innovation",
    icon: "💻",
    subTopics: [
      "Artificial intelligence applications",
      "Blockchain and cryptocurrency",
      "The rise of smart homes",
      "Cybersecurity essentials",
      "Virtual reality experiences",
      "Advancements in renewable energy tech",
      "Mobile app development trends",
      "The future of autonomous vehicles",
      "Cloud computing benefits",
      "Wearable technology innovations",
      "5G technology and its impact",
      "Quantum computing basics",
      "Internet of Things (IoT) devices",
      "Biotechnology breakthroughs",
      "Space exploration technologies",
      "Ethical considerations in tech",
      "Robotics in manufacturing",
      "Digital privacy concerns",
      "E-learning and online education platforms",
      "Augmented reality applications",
    ],
  },
  {
    id: "nature",
    name: "Nature & Environment",
    description: "Wildlife, ecology, and natural world",
    icon: "🌿",
    subTopics: [
      "Conservation of endangered species",
      "Climate change impact on oceans",
      "Rainforest ecosystems",
      "The role of bees in pollination",
      "Sustainable living practices",
      "Renewable energy sources",
      "Wildlife photography tips",
      "National parks to visit",
      "Marine life diversity",
      "Urban gardening techniques",
      "Recycling and waste management",
      "Desertification and its effects",
      "Bird migration patterns",
      "Environmental policies and legislation",
      "Coral reef conservation",
      "The impact of deforestation",
      "Ecotourism benefits and challenges",
      "Natural disaster preparedness",
      "Air pollution and health",
      "Green architecture and building design",
    ],
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    description: "Athletics, exercise, and wellness activities",
    icon: "⚽",
    subTopics: [
      "Training for a marathon",
      "Yoga for mental health",
      "The history of the Olympics",
      "Nutrition for athletes",
      "Popular team sports worldwide",
      "Home workout routines",
      "Extreme sports adventures",
      "Meditation and mindfulness",
      "Benefits of swimming",
      "The rise of esports",
      "Fitness technology and wearables",
      "Injury prevention in sports",
      "Women's sports achievements",
      "The psychology of competition",
      "Paralympic sports overview",
      "Martial arts disciplines",
      "Outdoor activities for fitness",
      "Sports coaching and mentorship",
      "Doping and ethics in sports",
      "The business of sports franchises",
    ],
  },
];

export const BRAND_NAME = {
  english: "LanguageAI",
  spanish: "IdiomaAI",
  french: "LangueAI",
  original: "BhashaAI",
};

export const LANGUAGE_CODES_TO_NAME = {
  en: "english",
  es: "spanish",
  fr: "french",
};

export const CONVERSATION_TYPES = {
  OPEN_ENDED: "OPEN_ENDED",
  GRAMMAR: "GRAMMAR",
  PERSONAL: "PERSONAL",
  TOPICS: "TOPICS",
  SCENARIOS: "SCENARIOS"
};
