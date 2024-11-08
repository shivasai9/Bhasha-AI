let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('languageApp', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create savedWords store if it doesn't exist
      if (!db.objectStoreNames.contains('savedWords')) {
        db.createObjectStore('savedWords', { keyPath: 'word' });
      }
      
      // Create articles store if it doesn't exist
      if (!db.objectStoreNames.contains('articles')) {
        db.createObjectStore('articles', { keyPath: 'id' });
      }
    };
  });
};

const getDatabase = async () => {
  if (db) return db;
  db = await openDB();
  return db;
};

export const saveWord = async (wordData) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['savedWords'], 'readwrite');
    const store = transaction.objectStore('savedWords');
    const request = store.put(wordData);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getWord = async (word) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['savedWords'], 'readonly');
    const store = transaction.objectStore('savedWords');
    const request = store.get(word);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getAllSavedWords = async () => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['savedWords'], 'readonly');
    const store = transaction.objectStore('savedWords');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const saveArticle = async (articleData) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['articles'], 'readwrite');
    const store = transaction.objectStore('articles');
    const request = store.put(articleData);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getArticle = async (id) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['articles'], 'readonly');
    const store = transaction.objectStore('articles');
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const getAllArticles = async () => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['articles'], 'readonly');
    const store = transaction.objectStore('articles');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const deleteArticle = async (id) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['articles'], 'readwrite');
    const store = transaction.objectStore('articles');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};