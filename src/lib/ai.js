// @ts-nocheck
import { withRetry } from './utils';
import { CREATE_RANDOM_ARTICLE, CREATE_CUSTOM_ARTICLE, generateArticleCreationPrompt } from './prompts';
import { getArticlesByLanguage } from './dbUtils';

class AIWrapper {
  constructor() {
    this.session = null;
  }

  async initialize() {
    try {
      // Don't reinitialize if we have a valid session
      if (this.session) return true;

      if (!window.ai?.languageModel) {
        console.warn("Chrome AI API not available");
        return false;
      }

      const { available } = await window.ai.languageModel.capabilities();
      if (available !== "readily") {
        console.warn("AI model not readily available");
        return false;
      }

      this.session = await window.ai.languageModel.create({
        systemPrompt: "You are a professional English content writer who creates engaging articles on interesting topics, maintaining factual accuracy without bias or vulgarity."
      });
      return true;
    } catch (error) {
      console.error("AI initialization failed:", error);
      return false;
    }
  }

  async generateArticle(customTopic = null) {
    try {
      const start = Date.now();
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      const prompt = await generateArticleCreationPrompt(customTopic);
      const generateWithRetry = async () => {
        if (!this.session) {
          throw new Error("Session is not initialized");
        }
        const result = await this.session.prompt(prompt);
        return JSON.parse(result.trim());
      };

      const parsed = await withRetry(generateWithRetry, 5, 1000);
      const end = Date.now();
      console.log(`Article generated in ${(end - start)/1000} seconds`);

      const response = {
        title: parsed.title || "Untitled Article",
        summary: parsed.summary || "No summary available.",
        imageKeywords: Array.isArray(parsed.imageKeywords) ? parsed.imageKeywords : [],
      };
      
      this.destroy();
      new Promise((resolve) => setTimeout(resolve, 500));
      // Just add a delay to finish up destroying the session
      return response;

    } catch (error) {
      console.error("Article generation failed:", error);
      this.destroy();
      throw error;
    }
  }

  destroy() {
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }
}

// Create singleton instance
export const aiWrapper = new AIWrapper();
