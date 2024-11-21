import { BRAND_NAME, WIKI_IMAGE_URL } from "./constants";
import { saveArticle } from "./dbUtils";
import { getInterfaceLanguage } from "./languageStorage";
import { translateArticle } from "./translation.service";
import { isUsableLicense } from "./licencing/licenceUtils";

export async function withRetry(fn, maxAttempts = 5, baseDelayMs = 1000) {
  if (typeof fn !== "function")
    throw new Error("First argument must be a function");
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10) {
    throw new Error("maxAttempts must be an integer between 1 and 10");
  }
  if (!Number.isInteger(baseDelayMs) || baseDelayMs < 100) {
    throw new Error("baseDelayMs must be an integer >= 100");
  }

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error);

      if (attempt < maxAttempts) {
        const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.3 * exponentialDelay;
        const delay = Math.min(exponentialDelay + jitter, 30000);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export async function fetchImagesData(keyword) {
  try {
    const response = await fetch(`${WIKI_IMAGE_URL}${keyword}`);
    const data = await response.json();
    let imagesData = [];
    if (data.imagesData && data.imagesData.length > 0) {
      imagesData = data.imagesData
        .filter(image => isUsableLicense(image.metaData?.LicenseShortName?.value))
        .map((image) => {
          const attribution = image.metaData ? {
            artist: image.metaData.Artist?.value || 'Unknown', // This is now HTML string
            licenseName: image.metaData.LicenseShortName?.value || 'Unknown License',
            licenseUrl: image.metaData.LicenseUrl?.value || '#',
            imagePage: image.descriptionUrl
          } : null;

          return {
            url: image.url,
            alt: keyword,
            source: "wiki",
            refUrl: image.descriptionUrl,
            attribution
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

export function convertToKebabCase(str) {
  return str.toLowerCase().split(" ").join("-");
}

export function convertFromKebabCase(str) {
  return str
    .split("-")
    .map((word, index) =>
      index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}

export function getUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export const filterImageUrls = (imagesData) => {
  const filteredImages = imagesData.filter((image) =>
    image.url
      .split(".")
      .pop()
      .toLowerCase()
      .match(/jpg|jpeg|png|gif|svg|webp|bmp|tiff/i)
  );

  return filteredImages;
};

export const getBrandName = () => {
  const interfaceLanguage = getInterfaceLanguage();
  const translatedName = BRAND_NAME[interfaceLanguage] || BRAND_NAME.default;
  return {
    original: BRAND_NAME.original,
    translated: translatedName
  };
}