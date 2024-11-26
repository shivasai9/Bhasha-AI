//@ts-nocheck
import { withRetry } from "./utils";
import { SENTENCE_SYSTEM_PROMPT, CORRECT_SENTENCE_PROMPT } from "./prompts/summaryPrompts";

class AISummaryCorrector {
  constructor() {
    this.session = null;
  }

  async initialize(systemPrompt = SENTENCE_SYSTEM_PROMPT) {
    try {
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
        systemPrompt: systemPrompt
      });
      return true;
    } catch (error) {
      console.error("AI initialization failed:", error);
      return false;
    }
  }

  async correctSummary(summary) {
    try {
      const start = Date.now();
      const prompt = CORRECT_SENTENCE_PROMPT
        .replace("{{sentence}}", summary);

      const generateWithRetry = async () => {
        this.destroy();
        const initialized = await this.initialize();
        if (!initialized) throw new Error("Could not initialize AI");

        if (!this.session) {
          throw new Error("Session is not initialized");
        }
        const result = await this.session.prompt(prompt);
        const parsedResult = JSON.parse(result.trim());
        console.log("Parsed result:", parsedResult);
        return parsedResult;
      };

      const parsed = await withRetry(generateWithRetry, 5, 1000);
      console.log(`Summary correction generated in ${(Date.now() - start) / 1000} seconds`);

      this.destroy();
      return parsed;
    } catch (error) {
      console.error("Summary correction failed:", error);
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

export const aiSummaryCorrector = new AISummaryCorrector();