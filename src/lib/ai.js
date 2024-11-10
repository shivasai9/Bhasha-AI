// @ts-nocheck
import { withRetry } from './utils';
import { CREATE_RANDOM_ARTICLE, CREATE_CUSTOM_ARTICLE } from './prompts';

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
      const start = Date.now();
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      const result = await this.session.prompt(CREATE_RANDOM_ARTICLE);
      const parsed = JSON.parse(result.trim());
      const end = Date.now();
      const diff = (end - start)/1000;
      console.log(`Article generated in ${diff} seconds`);

      // Destroy session after use
      this.destroy();

      // Add default fields if missing
      return {
        title: parsed.title || "Untitled Article",
        summary: parsed.summary || "No summary available.",
        text: parsed.text || "No content available.",
        imageKeywords: Array.isArray(parsed.imageKeywords) ? parsed.imageKeywords : ["article", "education"],
      };
    } catch (error) {
      console.error("Article generation failed:", error);
      this.destroy(); // Ensure session is destroyed even on error
      throw error;
    }
  }

  async generateCustomArticle(topic) {
    try {
      const start = Date.now();
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      const customPrompt = CREATE_CUSTOM_ARTICLE.replace('{{topic}}', topic);
      const result = await this.session.prompt(customPrompt);
      const parsed = JSON.parse(result.trim());
      const end = Date.now();
      const diff = (end - start)/1000;
      console.log(`Custom article generated in ${diff} seconds`);

      // Destroy session after use
      this.destroy();

      return {
        title: parsed.title || topic,
        summary: parsed.summary || "No summary available.",
        text: parsed.text || "No content available.",
        imageKeywords: Array.isArray(parsed.imageKeywords) ? parsed.imageKeywords : ["article", "education"],
      };
    } catch (error) {
      console.error("Custom article generation failed:", error);
      this.destroy(); // Ensure session is destroyed even on error
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
