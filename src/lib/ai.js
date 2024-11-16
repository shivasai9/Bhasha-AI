// @ts-nocheck
import { withRetry } from './utils';
import { 
  CREATE_RANDOM_ARTICLE, 
  CREATE_CUSTOM_ARTICLE, 
  CREATE_ARTICLE_QUESTIONS, 
  GENERATE_ARTICLE_CONTENT,
  GENERATE_WORD_INFO 
} from './prompts';
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

  async generateQuiz(title, content) {
    try {
      const start = Date.now();
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      // TODO: Add retry logic
      const prompt = CREATE_ARTICLE_QUESTIONS.replace("{{title}}", title);
      const customPrompt = prompt.replace("{{content}}", content);
      const generateWithRetry = async () => {
        console.log("Quiz execution started.....")
        console.log(customPrompt);
        if (!this.session) {
          throw new Error("Session is not initialized");
        }
        const result = await this.session.prompt(customPrompt);
        console.log("Quiz execution finished........")
        return JSON.parse(result.trim());
      };

      const parsed = await withRetry(generateWithRetry, 5, 1000);
      const end = Date.now();
      const diff = (end - start) / 1000;
      console.log(`Quiz generated in ${diff} seconds`);
      console.log(parsed);


      // Destroy session after use
      this.destroy();

      // Add default fields if missing
      return parsed.map((field, index) => {
        return {
          question: field.question || "Untitled Question",
          options: field.options || "No Options",
          answer: field.answer || "No Answer",
          explanation: field.explanation || "No Explanation",
        };
      });
    } catch (error) {
      console.error("Quiz generation failed:", error);
      this.destroy(); // Ensure session is destroyed even on error
      throw error;
    }
  }

  async generateContent(prompt) {
    try {
      const start = Date.now();
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      // Count input tokens
      const inputTokens = await this.session.countPromptTokens(prompt);
      console.log(`Input tokens: ${inputTokens}`);

      const generateWithRetry = async () => {
        if (!this.session) {
          throw new Error("Session is not initialized");
        }
        const result = await this.session.prompt(prompt);
        const cleaned = result
          .trim()
          .replace(/[^\w\s.,\n]/g, '')   // Keep words, spaces, dots, commas, newlines
          .replace(/[ \t]+/g, ' ')        // Replace multiple spaces/tabs with single space
          .replace(/,\s*\./g, '.')        // Replace ", ." with just "."
          .replace(/\s+\./g, '.')         // Remove spaces before dots
          .replace(/\.+/g, '.')           // Replace multiple dots with single dot
          .replace(/\n\s+/g, '\n')        // Remove spaces after newlines
          .replace(/\n{3,}/g, '\n\n')     // Replace 3+ newlines with double newline
          .trim();

        return cleaned;
      };

      const content = await withRetry(generateWithRetry, 5, 1000);
      console.log("*****raw content*****", content);
      
      // Log token usage stats
      console.log(`Total tokens used so far: ${this.session.tokensSoFar}`);
      console.log(`Tokens left in context: ${this.session.tokensLeft}`);
      console.log(`Max tokens allowed: ${this.session.maxTokens}`);

      const end = Date.now();
      console.log(`Content generated in ${(end - start)/1000} seconds`);

      this.destroy();
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return content;
    } catch (error) {
      console.error("Content generation failed:", error);
      this.destroy();
      throw error;
    }
  }

  async generateContentStreaming(prompt) {
    try {
      const initialized = await this.initialize();
      if (!initialized) throw new Error("Could not initialize AI");

      const stream = this.session.promptStreaming(prompt);
      return stream;
    } catch (error) {
      console.error("Content streaming failed:", error);
      this.destroy();
      throw error;
    }
  }

  async generateWordInfo(word) {
    try {
      const start = Date.now();
      
      const generateWithRetry = async () => {
        // Destroy existing session if any
        this.destroy();
        
        // Initialize new session
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error("Could not initialize AI");
        }

        const prompt = GENERATE_WORD_INFO.replace("{{word}}", word);
        const result = await this.session.prompt(prompt);
        return JSON.parse(result.trim());
      };

      const wordInfo = await withRetry(generateWithRetry, 5, 1000);
      const end = Date.now();
      console.log(`Word info generated in ${(end - start)/1000} seconds`);

      const response = {
        word: wordInfo.word || word,
        meaning: wordInfo.meaning || "No definition available",
        synonyms: wordInfo.synonyms || "",
        antonyms: wordInfo.antonyms || "",
        exampleSentence: wordInfo.exampleSentence || `Example with "${word}" not available.`
      };
      
      this.destroy();
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return response;
    } catch (error) {
      console.error("Word info generation failed:", error);
      this.destroy();
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
