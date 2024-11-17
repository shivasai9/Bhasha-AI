import { aiWrapper } from "./ai";
import { saveWord, getWordInfoByWord } from "./dbUtils";
import { getLanguage } from "./languageStorage";
import { translateContent } from "./translation.service";

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

export async function generateAndSaveWordInfo(word, articleID) {
  try {
    const currentLanguage = getLanguage();
    const isEnglish = currentLanguage.toLowerCase() === "english";

    const translatedWord = await translateContent(
      word,
      currentLanguage,
      "english"
    );

    const existingEnglishWordInfo = await getWordInfoByWord(
      translatedWord.toLowerCase()
    );

    if (existingEnglishWordInfo) {
      return await handleExistingWordInfo(
        existingEnglishWordInfo,
        word,
        currentLanguage,
        isEnglish
      );
    }

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

    return {
      ...finalWordInfo,
      wordId: savedWordId,
    };
  } catch (error) {
    console.error("Failed to generate and save word info:", error);
    throw error;
  }
}
