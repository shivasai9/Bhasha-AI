// @ts-nocheck
import { v4 as uuidv4 } from "@lukeed/uuid";
import { LANGUAGE_CODES } from "./constants";

export async function translateArticle(article, targetLanguage) {
  try {
    if (article.language.toLowerCase() === targetLanguage.toLowerCase()) {
      return article;
    }

    const langCode = LANGUAGE_CODES[targetLanguage.toLowerCase()];
    const translator = await translation.createTranslator({
      sourceLanguage: "en",
      targetLanguage: langCode,
    });

    const translatedTitle = await translator.translate(article.title);
    const translatedSummary = await translator.translate(article.summary);

    return {
      ...article,
      articleID: uuidv4(),
      title: translatedTitle,
      summary: translatedSummary,
      language: targetLanguage,
      originalArticleId: article.articleID,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Translation failed:", error);
    throw error;
  }
}