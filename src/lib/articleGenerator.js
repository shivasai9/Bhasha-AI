// @ts-nocheck
import { v4 as uuidv4 } from "@lukeed/uuid";
import { aiWrapper } from "./ai";
import { getArticlesByLanguage, saveArticle } from "./dbUtils";
import { LANGUAGE_CODES } from "./constants";

async function translateArticle(article, targetLanguage) {
  try {
    // Early return if already in target language
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

export async function generateArticles(language, customTopic = null, count = 3, onProgress = null) {
  try {
    let articles = await getArticlesByLanguage(language);
    
    if (articles.length < count || customTopic) {
      const isAiAvailable = await aiWrapper.initialize();
      
      if (isAiAvailable) {
        if (customTopic) {
          const articleData = await aiWrapper.generateCustomArticle(customTopic);
          const article = {
            articleID: uuidv4(),
            ...articleData,
            language: "english",
            timestamp: Date.now(),
            isSaved: false
          };
          
          const translatedArticle = language.toLowerCase() !== "english" 
            ? await translateArticle(article, language)
            : article;
            
          await saveArticle(translatedArticle);
          articles = [translatedArticle, ...articles];
          onProgress?.(articles);
        } else {
          // Generate only one article at a time
          const articleData = await aiWrapper.generateArticle();
          const article = {
            articleID: uuidv4(),
            ...articleData,
            language: "english",
            timestamp: Date.now(),
            isSaved: false
          };
          
          const translatedArticle = language.toLowerCase() !== "english"
            ? await translateArticle(article, language)
            : article;
            
          await saveArticle(translatedArticle);
          
          // Return array with single new article
          onProgress?.([translatedArticle]);
          return [...articles, translatedArticle];
        }
      }
    }

    return articles;
  } catch (error) {
    console.error("Article generation failed:", error);
    return [];
  } finally {
    aiWrapper.destroy();
  }
}
