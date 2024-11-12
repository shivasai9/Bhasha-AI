import { v4 as uuidv4 } from "@lukeed/uuid";
import { CREATE_RANDOM_ARTICLE } from "./prompts";
import { aiWrapper } from "./ai";
import { getArticlesByLanguage, saveArticle } from "./dbUtils";
import { getLanguage } from "./languageStorage";
import { fetchImagesData } from "./utils";

// Helper function to fetch existing articles by language
async function fetchExistingArticles(language) {
  return await getArticlesByLanguage(language);
}

// Helper function to initialize the AI wrapper
async function initializeAI() {
  return await aiWrapper.initialize();
}

// Helper function to generate a single article
export async function generateArticle(customTopic = null) {
  const language = getLanguage();
  try {
    const articleData = await aiWrapper.generateArticle(customTopic);
    const mostRelevantKeyword = articleData.imageKeywords[0];
    const imagesData = await fetchImagesData(mostRelevantKeyword);
    const article = {
      articleID: uuidv4(),
      ...articleData,
      language,
      timestamp: Date.now(),
      isSaved: false,
      imagesData,
    };
    console.log("Generated article:", article);
    await saveArticle(article);
    return article;
  } catch (error) {
    console.error("Article generation failed:", error);
    throw error;
  }
}

// Helper function to generate multiple articles
export async function generateMultipleArticles(count, onProgress) {
  const articles = [];
  for (let i = 0; i < count; i++) {
    try {
      const article = await generateArticle();
      articles.push(article);
      onProgress?.(articles); // Notify progress after each article

      // Add a small delay between generations
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate article ${i + 1}:`, error);
      break;
    }
  }
  return articles;
}

export async function generateArticles(
  count = 3,
  onProgress = null
) {
  const language = getLanguage();
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
