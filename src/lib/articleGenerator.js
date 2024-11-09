import { v4 as uuidv4 } from "@lukeed/uuid";
import { CREATE_RANDOM_ARTICLE } from "./prompts";
import { aiWrapper } from "./ai";
import { getArticlesByLanguage, saveArticle } from "./dbUtils";

// Remove or comment out the fallbackArticles constant
// const fallbackArticles = { ... }

export async function generateArticles(language, customTopic = null, count = 3, onProgress = null) {
  try {
    const existingArticles = await getArticlesByLanguage(language);
    let articles = [...existingArticles];
    
    // If we have enough articles from database, return them
    if (existingArticles.length >= count && !customTopic) {
      onProgress?.(articles);
      return articles.slice(0, count);
    }

    // Calculate how many more articles we need
    const neededCount = count - articles.length;

    if (neededCount > 0 || customTopic) {
      const isAiAvailable = await aiWrapper.initialize();
      
      if (isAiAvailable) {
        if (customTopic) {
          try {
            const articleData = await aiWrapper.generateArticle();
            const article = {
              articleID: uuidv4(),
              ...articleData,
              title: `${customTopic}: ${articleData.title}`,
              language,
              timestamp: Date.now(),
              isSaved: false
            };
            await saveArticle(article);
            return [article];
          } catch (error) {
            console.error("Custom topic generation failed:", error);
            return [];
          }
        } else {
          for (let i = 0; i < neededCount; i++) {
            try {
              const articleData = await aiWrapper.generateArticle();
              const article = {
                articleID: uuidv4(),
                ...articleData,
                language,
                timestamp: Date.now(),
                isSaved: false
              };
              await saveArticle(article);
              articles.push(article);
              onProgress?.(articles); // Notify progress after each article
              
              // Add small delay between generations
              await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
              console.error(`Failed to generate article ${i + 1}:`, error);
              break;
            }
          }
        }
      }
    }

    return articles;
  } catch (error) {
    console.error("Article generation failed:", error);
    return []; // Return empty array instead of fallback articles
  } finally {
    aiWrapper.destroy();
  }
}
