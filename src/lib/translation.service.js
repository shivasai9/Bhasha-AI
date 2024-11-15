// @ts-nocheck
import { LANGUAGE_CODES } from "./constants";
import { getUniqueId } from "./utils";

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
      articleID: getUniqueId(),
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