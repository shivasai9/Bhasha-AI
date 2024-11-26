import { aiSummaryCorrector } from '../aiCorrectSummary';
import { SENTENCE_SYSTEM_PROMPT } from '../prompts/summaryPrompts';

class ArticleSummaryService {
  constructor() {
    this.articleContent = null;
  }

  async initializeWithArticle(articleContent) {
    this.articleContent = articleContent;
    const enhancedSystemPrompt = `${SENTENCE_SYSTEM_PROMPT}`;
    
    try {
      const initialized = await aiSummaryCorrector.initialize(enhancedSystemPrompt);
      if (!initialized) {
        throw new Error("Failed to initialize AI summary corrector");
      }
      return true;
    } catch (error) {
      console.error("Failed to initialize article summary service:", error);
      return false;
    }
  }

  async correctSummary(summary) {
    if (!this.articleContent) {
      throw new Error("Article content not initialized");
    }

    try {
      const sentences = summary.split('.').filter(sentence => sentence.trim().length > 0);
      const results = [];

      for (const sentence of sentences) {
        const res = await aiSummaryCorrector.correctSummary(sentence.trim());
        results.push(res);
      }

      return results;
    } finally {
      aiSummaryCorrector.destroy();
      this.articleContent = null;
    }
  }
}

export const articleSummaryService = new ArticleSummaryService();