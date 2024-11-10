import { DB_NAME, DB_VERSION, STORES } from "./constants";

/** @type {IDBDatabase | null} */
let db = null;

/**
 * @returns {Promise<IDBDatabase>}
 */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = /** @type {IDBOpenDBRequest} */ (event.target).result;

      // Create savedWords store if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.WORDS)) {
        // `wordsStore` schema to store saved words and related details
        const wordStore = db.createObjectStore(STORES.WORDS, {
          keyPath: "wordID",
          autoIncrement: true,
        });
        // Fields:
        // - wordID (auto-incremented): Unique identifier for each saved word
        // - word: The word itself (e.g., "cosmology")
        // - meaning: Definition of the word
        // - synonyms: Array of synonyms (e.g., ["astrophysics", "astronomy"])
        // - antonyms: Array of antonyms, format same as synonyms
        // - exampleSentence: Example sentence using the word
        // - translations: Object with language codes and translations (e.g., { "es": "cosmología" })
        // - articleID: ID of the article where the word was encountered
        // - timestamp: When the word was saved
        wordStore.createIndex("wordIndex", "word", { unique: false });
        wordStore.createIndex("articleIDIndex", "articleID", { unique: false });
        wordStore.createIndex("timestampIndex", "timestamp", { unique: false });
      }

      // Create articles store if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.ARTICLES)) {
        // `articles` schema to store unique articles with metadata
        const articleMetadataStore = db.createObjectStore(
          STORES.ARTICLES,
          {
            keyPath: "articleID",
          }
        );
        // Fields:
        // - articleID: Unique identifier for each article
        // - language: Language of the article (e.g., "English")
        // - title: Title of the article
        // - summary: Brief summary of the article
        // - imageKeyWords: Array of keywords to fetch images (e.g., ["space", "stars"])
        // - imageURL: URL of the image fetched from Wikimedia
        // - isSaved: Boolean flag to track if the article is saved by the user
        // - timestamp: When the article was saved
        articleMetadataStore.createIndex("languageIndex", "language", {
          unique: false,
        });
        articleMetadataStore.createIndex("isSavedIndex", "isSaved", {
          unique: false,
        });
        articleMetadataStore.createIndex("titleIndex", "title", {
          unique: false,
        });
        articleMetadataStore.createIndex("timestampIndex", "timestamp", {
          unique: false,
        });
      }

      // Create articlesContent store if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.ARTICLES_CONTENT)) {
        // `articlesContent` schema to store content for each article by difficulty level
        const articleContentsStore = db.createObjectStore(
          STORES.ARTICLES_CONTENT,
          {
            keyPath: ["articleID", "level"],
          }
        );
        // Fields:
        // - articleID: Identifier linking to the article in `articlesMetadata`
        // - level: Difficulty level of the content (e.g., "easy", "medium", "hard")
        // - content: Full text of the article for this specific level
        articleContentsStore.createIndex("articleIDIndex", "articleID", {
          unique: false,
        });
      }

      // Create quizStore if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.QUIZ)) {
        // `quizStore` schema to store quizzes related to each article
        const quizStore = db.createObjectStore(STORES.QUIZ, {
          keyPath: "quizID",
          autoIncrement: true,
        });
        // Fields:
        // - quizID (auto-incremented): Unique identifier for each quiz
        // - articleID: Identifier of the article associated with this quiz
        // - questions: Array of question objects for the quiz
        //      - questionText: The text of the question
        //      - options: Array of answer options (if multiple choice)
        //      - correctAnswer: Correct answer index or text
        // - userAnswers: Array of user's selected answers (for tracking user performance)
        // - timestamp: When the quiz was created or last updated
        quizStore.createIndex("articleIDIndex", "articleID", { unique: false });
        quizStore.createIndex("timestampIndex", "timestamp", { unique: false });
      }

      // Create summaryStore if it doesn't exist
      if (!db.objectStoreNames.contains(STORES.SUMMARY_CHALLENGE)) {
        // `summaryStore` schema to store user-generated summaries and AI feedback
        const summaryStore = db.createObjectStore(STORES.SUMMARY_CHALLENGE, {
          keyPath: "summaryID",
          autoIncrement: true,
        });
        // Fields:
        // - summaryID (auto-incremented): Unique identifier for each summary
        // - articleID: Identifier of the article associated with this summary
        // - userSummaryText: Text of the user-generated summary
        // - feedback: Object containing feedback from the AI
        //      - errors: Array of objects with error details (e.g., sentence, error type, suggestion)
        //      - correctedText: Corrected version of the summary
        // - timestamp: When the summary was created
        summaryStore.createIndex("articleIDIndex", "articleID", {
          unique: false,
        });
        summaryStore.createIndex("timestampIndex", "timestamp", {
          unique: false,
        });
      }
    };
  });
};

/**
 * @returns {Promise<IDBDatabase>}
 */
export const getDatabase = async () => {
  if (db) return db;
  db = await openDB();
  return db;
};
