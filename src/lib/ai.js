// @ts-nocheck
import { withRetry } from './utils';
import { CREATE_RANDOM_ARTICLE } from './prompts';

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
        systemPrompt: "You are an educational content generator."
      });
      return true;
    } catch (error) {
      console.error("AI initialization failed:", error);
      return false;
    }
  }

  async generateArticle() {
    try {
      // Ensure session is initialized
      const start = Date.now();
      if (!this.session) {
        const initialized = await this.initialize();
        if (!initialized) throw new Error("Could not initialize AI");
      }

      const result = await this.session.prompt(CREATE_RANDOM_ARTICLE);
      const parsed = JSON.parse(result.trim());
      const end = Date.now();
      const diff = (end - start)/1000;
      console.log(`Article generated in ${diff} seconds`);
      // Add default fields if missing
      const article = {
        title: parsed.title || "Untitled Article",
        summary: parsed.summary || "No summary available.",
        text: parsed.text || "No content available.",
        imageKeywords: Array.isArray(parsed.imageKeywords) ? parsed.imageKeywords : ["article", "education"],
      };

      return article;
    } catch (error) {
      console.error("Article generation failed:", error);
      throw error;
    }
  }

  // Only destroy when explicitly called
  destroy() {
    if (this.session) {
      this.session.destroy();
      this.session = null;
    }
  }
}

// Create singleton instance
export const aiWrapper = new AIWrapper();
