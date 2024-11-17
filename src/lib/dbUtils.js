import { STORES } from "./constants";
import { getDatabase } from "./db";

/**
 * @template T
 * @param {string} storeName
 * @param {"readonly" | "readwrite"} mode
 * @param {(store: IDBObjectStore) => IDBRequest<T> | Promise<T>} operation
 * @returns {Promise<T>}
 */
const performTransaction = async (storeName, mode, operation) => {
  const db = await getDatabase();
  const transaction = db.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = operation(store);
    if (request instanceof Promise) {
      request.then(resolve).catch(reject);
    } else {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    }
  });
};

// Words Store Operations
export const saveWord = (wordData) =>
  performTransaction(STORES.WORDS, "readwrite", (store) =>
    store.put({
      ...wordData,
      isSaved: wordData.isSaved ?? false,
      timestamp: wordData.timestamp || new Date().toISOString(),
    })
  );

export const getWordById = (wordId) =>
  performTransaction(STORES.WORDS, "readonly", (store) => store.get(wordId));

export const getWordsByArticle = (articleId) =>
  performTransaction(STORES.WORDS, "readonly", (store) =>
    store.index("articleIDIndex").getAll(articleId)
  );

export const getRecentWords = (limit = 10) =>
  performTransaction(STORES.WORDS, "readonly", (store) =>
    store.index("timestampIndex").getAll(null, limit)
  );

export const getSavedWords = () =>
  performTransaction(
    STORES.WORDS,
    "readonly",
    (store) =>
      new Promise((resolve, reject) => {
        const cursor = store.index("isSavedIndex").openCursor(1);
        const words = [];

        cursor.onerror = () => reject(cursor.error);
        cursor.onsuccess = function (event) {
          const cursor = /** @type {IDBRequest} */ (event.target).result;
          if (cursor) {
            words.push(cursor.value);
            cursor.continue();
          } else {
            resolve(words);
          }
        };
      })
  );

export const updateWordStatus = (wordId, isSaved) =>
  performTransaction(STORES.WORDS, "readwrite", async (store) => {
    const word = await store.get(wordId);
    if (!word) throw new Error("Word not found");

    const updatedWord = {
      ...word,
      isSaved,
      timestamp: new Date().toISOString(),
    };
    return store.put(updatedWord);
  });

export const updateWordTranslations = (wordId, translations) =>
  performTransaction(
    STORES.WORDS,
    "readwrite",
    async (store) =>
      new Promise((resolve, reject) => {
        const getRequest = store.get(wordId);

        getRequest.onerror = () => reject(getRequest.error);
        getRequest.onsuccess = () => {
          const word = getRequest.result;
          if (!word) {
            reject(new Error("Word not found"));
            return;
          }

          const updatedWord = {
            ...word,
            translations: { ...word.translations, ...translations },
            timestamp: new Date().toISOString(),
          };

          const putRequest = store.put(updatedWord);
          putRequest.onerror = () => reject(putRequest.error);
          putRequest.onsuccess = () => resolve(putRequest.result);
        };
      })
  );

export const getWordInfoByWord = (word) =>
  performTransaction(
    STORES.WORDS,
    "readonly",
    (store) =>
      new Promise((resolve, reject) => {
        const request = store.index("wordIndex").get(word);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          resolve(request.result || null);
        };
      })
  );

// Articles Store Operations
export const saveArticle = (articleData) =>
  performTransaction(STORES.ARTICLES, "readwrite", (store) =>
    store.put(articleData)
  );

export const getArticleById = (articleId) =>
  performTransaction(STORES.ARTICLES, "readonly", (store) =>
    store.get(articleId)
  );

export const getSavedArticles = () =>
  performTransaction(STORES.ARTICLES, "readonly", (store) =>
    store.index("isSavedIndex").getAll(1)
  );

export const getArticlesByLanguage = (language) =>
  performTransaction(STORES.ARTICLES, "readonly", (store) =>
    store.index("languageIndex").getAll(language)
  );

// Articles Content Operations
export const saveArticleContent = (articleContent) =>
  performTransaction(STORES.ARTICLES_CONTENT, "readwrite", (store) =>
    store.put(articleContent)
  );

export const getArticleContent = (articleId, level, language) =>
  performTransaction(STORES.ARTICLES_CONTENT, "readonly", (store) =>
    store.get([articleId, level, language])
  );

export const getAllArticleContent = (articleId) =>
  performTransaction(STORES.ARTICLES_CONTENT, "readonly", (store) =>
    store.index("articleIDIndex").getAll(articleId)
  );

// Quiz Operations
export const saveQuizQuestions = (quizData) =>
  performTransaction(STORES.QUIZ, "readwrite", (store) => store.put(quizData));

export const getQuizQuestions = (articleId, level, language) =>
  performTransaction(STORES.QUIZ, "readonly", (store) =>
    store.get([articleId, level, language])
  );

export const getQuizzesByArticle = (articleId) =>
  performTransaction(STORES.QUIZ, "readonly", (store) =>
    store.index("articleIDIndex").getAll(articleId)
  );

export const getRecentQuizzes = (limit = 10) =>
  performTransaction(STORES.QUIZ, "readonly", (store) =>
    store.index("timestampIndex").getAll(null, limit)
  );

// Summary Challenge Operations
export const saveSummary = (summaryData) =>
  performTransaction(STORES.SUMMARY_CHALLENGE, "readwrite", (store) =>
    store.put(summaryData)
  );

export const getSummaryById = (summaryId) =>
  performTransaction(STORES.SUMMARY_CHALLENGE, "readonly", (store) =>
    store.get(summaryId)
  );

export const getSummariesByArticle = (articleId) =>
  performTransaction(STORES.SUMMARY_CHALLENGE, "readonly", (store) =>
    store.index("articleIDIndex").getAll(articleId)
  );

export const getRecentSummaries = (limit = 10) =>
  performTransaction(STORES.SUMMARY_CHALLENGE, "readonly", (store) =>
    store.index("timestampIndex").getAll(null, limit)
  );

// Language Store Operations
export const saveLanguage = (languageData) =>
  performTransaction(STORES.LANGUAGES, "readwrite", (store) =>
    store.put(languageData)
  );

export const getLanguageByCode = (langCode) =>
  performTransaction(STORES.LANGUAGES, "readonly", (store) =>
    store.get(langCode)
  );

export const getAllLanguages = () =>
  performTransaction(STORES.LANGUAGES, "readonly", (store) => store.getAll());

// Generic Helpers
export const deleteRecord = (storeName, key) =>
  performTransaction(storeName, "readwrite", (store) => store.delete(key));

export const updateRecord = (storeName, data) =>
  performTransaction(storeName, "readwrite", (store) => store.put(data));

export const upsertRecord = (storeName, key, data) =>
  performTransaction(storeName, "readwrite", async (store) => {
    let updatedData;
    if (key !== undefined && key !== null) {
      const existingData = await store.get(key);
      updatedData = existingData ? { ...existingData, ...data } : { ...data };
    } else {
      updatedData = { ...data };
    }
    return store.put(updatedData);
  });

export const getAllRecords = (storeName) =>
  performTransaction(storeName, "readonly", (store) => store.getAll());

export const clearStore = (storeName) =>
  performTransaction(storeName, "readwrite", (store) => store.clear());
