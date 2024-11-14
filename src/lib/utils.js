import { WIKI_IMAGE_URL } from "./constants";
import { saveArticle } from "./dbUtils";
import { translateArticle } from "./translation.service";

/**
 * Retry wrapper for async functions with exponential backoff and jitter
 * @template T
 * @param {() => Promise<T>} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of retry attempts (1-10)
 * @param {number} baseDelayMs - Base delay between retries in milliseconds
 * @returns {Promise<T>}
 */
export async function withRetry(fn, maxAttempts = 5, baseDelayMs = 1000) {
  if (typeof fn !== 'function') throw new Error('First argument must be a function');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new Error('maxAttempts must be an integer between 1 and 10');
  }
  if (!Number.isInteger(baseDelayMs) || baseDelayMs < 100) {
    throw new Error('baseDelayMs must be an integer >= 100');
  }

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt < maxAttempts) {
        // Calculate delay with exponential backoff and jitter
        const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.3 * exponentialDelay;
        const delay = Math.min(exponentialDelay + jitter, 30000);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Fetches image URL from Wikimedia API based on keyword
 * @param {string} keyword - Search keyword for image
 * @returns {Promise<string|null>} Image URL or null if not found
 */
export async function fetchImagesData(keyword) {
  try {
    const response = await fetch(`${WIKI_IMAGE_URL}${keyword}`);
    const data = await response.json();
    let imagesData = [];
    if (data.imagesData && data.imagesData.length > 0) {
      imagesData = data.imagesData.map((image) => {
        return {
          url: image.url,
          alt: keyword,
          source: "wiki",
          refUrl: image.descriptionUrl,
        };
      });
    }

    return imagesData;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

export async function translateAndSaveArticle(article, targetLanguage) {
  try {
    const translatedArticle = await translateArticle(article, targetLanguage);
    await saveArticle(translatedArticle);
    return translatedArticle;
  } catch (error) {
    console.error("Translation and save failed:", error);
    throw error;
  }
}
