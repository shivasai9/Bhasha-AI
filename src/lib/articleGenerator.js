import { GENERATE_ARTICLE_CONTENT } from "./prompts";
import { aiWrapper } from "./ai";
import {
  getArticlesByLanguage,
  saveArticle,
  saveArticleContent,
} from "./dbUtils";
import { getLearningLanguage } from "./languageStorage";
import { fetchImagesData, getUniqueId } from "./utils";
import { translateArticle } from "./translation.service";

async function fetchExistingArticles(language) {
  return await getArticlesByLanguage(language);
}

async function initializeAI() {
  return await aiWrapper.initialize();
}

async function generateAndSaveArticle(customTopic = null, language) {
  try {
    const articleData = await aiWrapper.generateArticle(customTopic);
    const mostRelevantKeyword = articleData.imageKeywords[0];
    
    let imagesData = [];
    try {
      imagesData = await fetchImagesData(mostRelevantKeyword);
    } catch (error) {
      console.warn('Failed to fetch images, continuing without images:', error);
    }

    const englishArticle = {
      articleID: getUniqueId(),
      ...articleData,
      language: "english",
      createdDate: Date.now(),
      isSaved: false,
      imagesData,
    };

    await saveArticle(englishArticle);

    let translatedArticle = null;
    if (language.toLowerCase() !== "english") {
      translatedArticle = await translateArticle(englishArticle, language);
      await saveArticle(translatedArticle);
    }

    return translatedArticle || englishArticle;
  } catch (error) {
    console.error("Article generation failed:", error);
    throw error;
  }
}

export async function generateArticle(customTopic = null) {
  const language = getLearningLanguage();
  return await generateAndSaveArticle(customTopic, language);
}

export async function generateMultipleArticles(count, onProgress) {
  const articles = [];
  for (let i = 0; i < count; i++) {
    try {
      // This await makes execution sequential - next iteration won't start
      // until either success or all retries are exhausted
      const article = await generateArticle();
      articles.push(article);
      onProgress?.(articles);

      // This delay is also sequential
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate article ${i + 1}:`, error);
      break; // Stops the loop on failure
    }
  }
  return articles;
}

export async function generateArticles(count = 3, onProgress = null) {
  const language = getLearningLanguage();
  let articles = [];
  try {
    const existingArticles = await fetchExistingArticles(language);
    articles = [...existingArticles];
    const neededCount = count - articles.length;
    const isAiAvailable = await initializeAI();

    if (neededCount > 0 && isAiAvailable) {
      await generateMultipleArticles(neededCount, onProgress);
    }
  } catch (error) {
    console.error("Article generation failed:", error);
    return [];
  } finally {
    aiWrapper.destroy();
  }
}

export async function generateArticleContent(
  articleId,
  level,
  title,
  summary,
  useStreaming = false,
  onProgress
) {
  try {
    const prompt = GENERATE_ARTICLE_CONTENT.replace("{{level}}", level)
      .replace("{{title}}", title)
      .replace("{{summary}}", summary);

    if (useStreaming) {
      const stream = await aiWrapper.generateContentStreaming(prompt);
      let content = "";

      for await (const chunk of stream) {
        content = chunk;
        if (onProgress) {
          onProgress(content);
        }
      }

      const articleContent = {
        articleID: articleId,
        level,
        content,
        language: "english",
        timestamp: Date.now(),
      };

      await saveArticleContent(articleContent);
      return content;
    } else {
      const content = await aiWrapper.generateContent(prompt);
      const articleContent = {
        articleID: articleId,
        level,
        content,
        language: "english",
        timestamp: Date.now(),
      };

      await saveArticleContent(articleContent);
      onProgress?.(content);
      return content;
    }
  } catch (error) {
    console.error("Error generating article content:", error);
    throw error;
  }
}
