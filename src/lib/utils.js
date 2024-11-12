import { WIKI_IMAGE_URL } from "./constants";

/**
 * Retry wrapper for async functions
 * @template T
 * @param {() => Promise<T>} fn - Function to retry
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @param {number} delayMs - Delay between retries in milliseconds
 * @returns {Promise<T>}
 */
export async function withRetry(fn, maxAttempts = 5, delayMs = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
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
