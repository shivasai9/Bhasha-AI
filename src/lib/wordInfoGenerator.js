import { aiWrapper } from "./ai";
import { saveWord, getWordInfoByWord } from "./dbUtils";
import { getLanguage } from "./languageStorage";
import { translateContent } from "./translation.service";

let requestQueue = [];
let isProcessing = false;

async function translateWordInfo(wordInfo, targetLanguage) {
  try {
    const translatedInfo = {
      ...wordInfo,
      meaning: await translateContent(
        wordInfo.meaning,
        "english",
        targetLanguage
      ),
      synonyms: await Promise.all(
        wordInfo.synonyms.map((syn) =>
          translateContent(syn, "english", targetLanguage)
        )
      ),
      antonyms: await Promise.all(
        wordInfo.antonyms.map((syn) =>
          translateContent(syn, "english", targetLanguage)
        )
      ),
      exampleSentence: await translateContent(
        wordInfo.exampleSentence,
        "english",
        targetLanguage
      ),
      language: targetLanguage,
    };
    return translatedInfo;
  } catch (error) {
    console.error("Error translating word info:", error);
    throw error;
  }
}

async function handleExistingWordInfo(
  existingInfo,
  originalWord,
  currentLanguage,
  isEnglish
) {
  if (!isEnglish) {
    const translatedInfo = await translateWordInfo(
      existingInfo,
      currentLanguage
    );
    return {
      ...translatedInfo,
      word: originalWord,
      wordId: await saveWord(translatedInfo),
    };
  }
  return {
    ...existingInfo,
    wordId: existingInfo.id,
  };
}

function prepareWordInfo(wordInfo, translatedWord, articleID) {
  return {
    word: translatedWord.toLowerCase(),
    meaning: wordInfo.meaning,
    synonyms: wordInfo.synonyms.split("|").map((s) => s.trim()),
    antonyms: wordInfo.antonyms.split("|").map((s) => s.trim()),
    exampleSentence: wordInfo.exampleSentence,
    translations: {},
    articleID,
    savedAt: Date.now(),
    isSaved: false,
    language: "english",
  };
}

async function translateAndSaveWordInfo(
  baseWordInfo,
  originalWord,
  targetLanguage
) {
  const translatedInfo = await translateWordInfo(baseWordInfo, targetLanguage);
  return {
    ...translatedInfo,
    word: originalWord,
  };
}

function updateQueue(newRequest) {
  // In queue, only keep the first and last request
  // discard all the requests in between
  if (requestQueue.length === 0 || requestQueue.length === 1) {
    requestQueue.push(newRequest);
  } else {
    requestQueue.splice(1, requestQueue.length - 1, newRequest);
  }
}

async function processWordInfoQueue() {
  if (isProcessing || requestQueue.length === 0) {
    return;
  }

  isProcessing = true;
  try {
    const request = requestQueue[0];
    const { word, articleID, resolve, reject } = request;

    try {
      const currentLanguage = getLanguage();
      const isEnglish = currentLanguage.toLowerCase() === "english";

      const translatedWord = await translateContent(word, currentLanguage, "english");
      const existingEnglishWordInfo = await getWordInfoByWord(translatedWord.toLowerCase());

      let result;
      if (existingEnglishWordInfo) {
        result = await handleExistingWordInfo(
          existingEnglishWordInfo,
          word,
          currentLanguage,
          isEnglish
        );
      } else {
        const wordInfo = await aiWrapper.generateWordInfo(translatedWord);
        let finalWordInfo = prepareWordInfo(wordInfo, translatedWord, articleID);
        let savedWordId = await saveWord(finalWordInfo);

        if (!isEnglish) {
          finalWordInfo = await translateAndSaveWordInfo(
            finalWordInfo,
            word,
            currentLanguage
          );
          savedWordId = await saveWord(finalWordInfo);
        }

        result = {
          ...finalWordInfo,
          wordId: savedWordId,
        };
      }

      resolve(result);
    } catch (error) {
      reject(error);
    }
  } finally {
    requestQueue.shift();
    isProcessing = false;

    if (requestQueue.length > 0) {
      setTimeout(processWordInfoQueue, 0);
    }
  }
}

export function generateAndSaveWordInfo(word, articleID) {
  return new Promise((resolve, reject) => {
    const newRequest = { word, articleID, resolve, reject };
    updateQueue(newRequest);
    
    if (!isProcessing) {
      processWordInfoQueue();
    }
  });
}
