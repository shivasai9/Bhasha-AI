
// @ts-nocheck

import { LANGUAGE_CODES_TO_NAME } from "./constants";

let detector = null;

export async function initializeDetector() {
  try {
    const canDetect = await translation.canDetect();
    
    if (canDetect === 'no') {
      throw new Error('Language detection is not available');
    }

    detector = await translation.createDetector();
    
    if (canDetect === 'downloading') {
      detector.addEventListener('downloadprogress', (e) => {
        console.log(`Detector download progress: ${e.loaded}/${e.total}`);
      });
      await detector.ready;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize language detector:', error);
    throw error;
  }
}

export async function detectLanguage(text) {
  try {
    if (!detector) {
      await initializeDetector();
    }

    const results = await detector.detect(text);
    const topResult = results.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );
    
    return {
      languageCode: topResult.detectedLanguage,
      languageName: LANGUAGE_CODES_TO_NAME[topResult.detectedLanguage] || "english",
      confidence: topResult.confidence
    };
  } catch (error) {
    console.error('Language detection failed:', error);
    throw error;
  }
}