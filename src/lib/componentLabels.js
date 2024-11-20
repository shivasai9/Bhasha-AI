import { TOPICS } from './constants';

export const DIFFICULTY_MODAL_LABELS = {
  title: "Custom Difficulty Level",
  customLevelLabel: "Custom Level Name",
  customLevelPlaceholder: "Enter your custom level...",
  suggestedPresetsTitle: "Suggested Presets",
  proceedButton: "Proceed",
  presets: [
    {
      label: "Creative Writing",
      description: "Focus on imaginative expression and storytelling"
    },
    {
      label: "For Children Below 5",
      description: "Simple vocabulary and basic concepts"
    },
    {
      label: "Technical",
      description: "Advanced terminology and complex concepts"
    },
    {
      label: "Conversational",
      description: "Focus on daily dialogue and common phrases"
    }
  ]
};

export const ENHANCED_DIFFICULTY_MODAL_LABELS = {
  title: "Select Difficulty Level",
  customLevelLabel: "Custom Level Name",
  customLevelPlaceholder: "Enter your custom level...",
  suggestedPresetsTitle: "Custom Presets",
  customLevelButton: {
    withCustom: "Apply Custom Level",
    withPreset: (level) => `Apply ${level} Level`,
    default: "Select a Difficulty Level"
  },
  presetDifficulties: [
    {
      id: 'easy',
      label: 'Easy',
      description: 'Simple vocabulary and basic sentence structures',
      className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
    },
    {
      id: 'medium',
      label: 'Medium',
      description: 'Moderate complexity with varied vocabulary',
      className: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
    },
    {
      id: 'hard',
      label: 'Hard',
      description: 'Complex sentences and advanced vocabulary',
      className: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
    }
  ],
  presets: [
    {
      label: "Creative Writing",
      description: "Focus on imaginative expression and storytelling"
    },
    {
      label: "For Children Below 5",
      description: "Simple vocabulary and basic concepts"
    },
    {
      label: "Technical",
      description: "Advanced terminology and complex concepts"
    },
    {
      label: "Conversational",
      description: "Focus on daily dialogue and common phrases"
    }
  ]
};

export const ARTICLE_CARD_LABELS = {
  customLevelButton: "Custom Level",
  easyLabel: "Easy",
  mediumLabel: "Medium",
  hardLabel: "Hard",
  orText: "or"
};

export const CUSTOM_TOPIC_FORM_LABELS = {
  inputPlaceholder: "Enter any topic you want to learn about...",
  generateButton: "Generate",
  formTitle: "Create a Custom Article"
};

export const ARTICLE_LIST_LABELS = {
  pageTitle: "Available Articles",
  customArticleButton: "Custom Article",
  loadMoreButton: "Load More Articles",
  generatingArticle: "Generating custom article...",
  generatingArticles: "Generating article(s)... ({count} remaining)",
  goBack: "Go back"
};

export const SETTINGS_LABELS = {
  pageTitle: "Settings",
  backButton: "Back",
  saveButton: "Save Changes",
  interfaceSection: {
    title: "Choose your language",
    description: "This will be used throughout the website for navigation and instructions"
  },
  learningSection: {
    title: "Learning Language",
    description: "Select the language you want to learn. We'll create personalized content to help you master this language."
  }
};

export const LANGUAGE_DROPDOWN_LABELS = {
  interfaceLanguage: "Interface Language",
  learningLanguage: "Learning Language"
};

export const ARTICLE_VIEW_LABELS = {
  backButton: "Back",
  loadingMessage: "Generating article content...",
  tabs: [
    {
      id: "read",
      label: "Read",
      description: "Read the article and click on words to see their meanings, translations, and more."
    },
    {
      id: "summarize",
      label: "Summarize",
      description: "Write a summary of the article and get AI-powered feedback to improve your writing."
    },
    {
      id: "quiz",
      label: "Quiz",
      description: "Test your understanding of the article with interactive questions."
    }
  ]
};

export const AUDIO_PLAYER_LABELS = {
  playButton: "Play Audio",
  pauseButton: "Pause Audio",
  loadingText: "Loading audio...",
  errorText: "Error loading audio",
  speedLabel: "Speed:",
  tooltips: {
    reset: "Start from beginning",
    skipBack: "Go back 5 words",
    playPause: {
      play: "Start reading",
      pause: "Pause reading"
    },
    volume: "Adjust volume",
    speed: "Change reading speed",
    voice: "Change voice settings"
  },
  volumeOptions: [
    { value: 1, label: "100%" },
    { value: 0.75, label: "75%" },
    { value: 0.5, label: "50%" },
    { value: 0.25, label: "25%" },
    { value: 0, label: "Mute" }
  ],
  speedOptions: "x Speed",
  playbackStatus: {
    playing: "Now reading...",
    stopped: "Click play to start"
  },
  voiceDefault: "Voice"
};

export const ARTICLE_CONTENT_LABELS = {
  difficultyLevels: {
    title: "Select Difficulty Level",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    custom: "Custom"
  },
  articleInfo: {
    readingTime: "min read",
    wordCount: "words",
    difficulty: "Difficulty:",
    source: "Source: Wikipedia",
    noSummary: "No summary available"
  },
  loading: {
    title: "Loading content...",
    description: "Please wait while we prepare your article"
  },
  clickableWordsHint: "Click on any word to see its meaning and translation",
  noContentMessage: "No content available"
};

export const DRAGGABLE_TOOLBAR_LABELS = {
  header: "Article Controls",
  actions: {
    summary: {
      fullArticle: {
        title: "Full Article",
        description: "View complete content"
      },
      summary: {
        title: "Summary",
        description: "Get quick overview"
      }
    },
    difficulty: {
      title: "Difficulty Level",
      changeHint: "Click to change level"
    }
  }
};

export const SUMMARY_WRITER_LABELS = {
  title: "Write Your Summary",
  languageWarning: {
    message: "Summary writing is only available in English. Please switch to English to use this feature."
  },
  textArea: {
    placeholder: {
      english: "Write your summary here...",
      other: "Please switch to English to write your summary"
    }
  },
  submitButton: {
    loading: "Analyzing...",
    default: "Submit for Feedback"
  },
  feedback: {
    suggestions: {
      title: "Suggestions for Improvement",
      originalLabel: "Original:",
      suggestionLabel: "Suggestion:"
    },
    corrected: {
      title: "Corrected Version"
    }
  }
};

export const QUIZ_SECTION_LABELS = {
  completion: {
    title: "Quiz Complete!",
    subtitle: "Here's how well you understood the article",
    scoreText: "You got {correct} out of {total} questions right",
    tryAgainButton: "Try Again"
  },
  progress: {
    questionProgress: "Question {current} of {total}",
    percentComplete: "{percent}% Complete"
  },
  question: {
    correctAnswer: "Correct Answer: {answer}"
  },
  buttons: {
    nextQuestion: "Next Question",
    showResults: "Show Results"
  }
};

export const HEADER_LABELS = {
  navigation: {
    articles: "Articles"
  },
  userMenu: {
    savedWords: "Saved Words",
    savedArticles: "Saved Articles",
    settings: "Settings"
  }
};

export const LANGUAGE_SELECTOR_LABELS = {
  steps: {
    interface: {
      title: "Choose your language",
      description: "This will be used throughout the website for navigation and instructions. You can change this later in settings.",
    },
    learning: {
      title: "Which language would you like to learn?",
      description: "Select the language you want to learn. We'll create personalized content to help you master this language efficiently.",
    },
    topics: {
      title: "What interests you?",
      description: "Choose topics that interest you and we'll curate content aligned with your preferences. Add custom topics or select from our suggestions.",
      skipButton: "Skip for now",
    }
  },
  customTopics: {
    addButton: "Add Custom Topic",
    inputPlaceholder: "Enter your topic...",
    addNewButton: "Add",
  },
  continueButton: "Continue with {count} topics",
  backButton: "Go back",
  poweredBy: "Powered by Chrome Built-In AI",
};

export const TOPIC_LABELS = {
  TOPICS: TOPICS
};
