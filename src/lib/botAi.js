// @ts-nocheck
import { PROMPTS } from '../prompts/botPrompts';

class BotAIWrapper {
  constructor() {
    this.session = null;
    this.articleContent = null;
  }

  async initializeBotSession(articleContent) {
    try {
      this.articleContent = articleContent;

      if (!this.session || this.session?.destroyed) {
        if (!window.ai?.languageModel) {
          console.warn("Chrome AI API not available");
          return false;
        }

        const { available } = await window.ai.languageModel.capabilities();
        if (available !== "readily") {
          console.warn("AI model not readily available");
          return false;
        }
  console.log("Creating new session from botAi.js");
        this.session = await window.ai.languageModel.create({
          systemPrompt: PROMPTS.SYSTEM(this.articleContent),
        });
      }
      return this.session;
    } catch (error) {
      console.error("Bot AI initialization failed:", error);
      return false;
    }
  }

  async askBot(userPrompt) {
    try {
      const start = Date.now();

      if (!this.session || this.session?.destroyed) {
        if (!this.articleContent) {
          throw new Error("Article content not set");
        }
        const initialized = await this.initializeBotSession(this.articleContent);
        if (!initialized) {
          throw new Error("Could not initialize Bot AI");
        }
      }

      if (this.session.tokensLeft < 1000) {
        console.log("Token limit approaching, creating new session...");
        this.destroy();
        const initialized = await this.initializeBotSession(this.articleContent);
        if (!initialized) {
          throw new Error("Could not initialize new Bot AI session");
        }
      }

      console.log(`Before prompt - Tokens: ${this.session.tokensSoFar}/${this.session.maxTokens} (${this.session.tokensLeft} left)`);
      
      const result = await this.session.prompt(userPrompt);
      
      console.log(`After prompt - Tokens: ${this.session.tokensSoFar}/${this.session.maxTokens} (${this.session.tokensLeft} left)`);
      
      const cleaned = result
        .trim()
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s+/g, "\n");

      const end = Date.now();
      console.log(`Bot response generated in ${(end - start) / 1000} seconds`);

      return cleaned;
    } catch (error) {
      console.error("Bot response generation failed:", error);
      throw error;
    }
  }

  async askBotStream(userPrompt, onChunk) {
    try {
      const start = Date.now();

      if (!this.session || this.session?.destroyed) {
        if (!this.articleContent) {
          throw new Error("Article content not set");
        }
        const initialized = await this.initializeBotSession(this.articleContent);
        if (!initialized) {
          throw new Error("Could not initialize Bot AI");
        }
      }

      if (this.session.tokensLeft < 1000) {
        console.log("Token limit approaching, creating new session...");
        this.destroy();
        const initialized = await this.initializeBotSession(this.articleContent);
        if (!initialized) {
          throw new Error("Could not initialize new Bot AI session");
        }
      }

      console.log(`Before prompt - Tokens: ${this.session.tokensSoFar}/${this.session.maxTokens} (${this.session.tokensLeft} left)`);
      
      let lastResponse = '';
      const stream = await this.session.promptStreaming(userPrompt);
      
      for await (const chunk of stream) {
        onChunk(chunk);
      }
      
      console.log(`After prompt - Tokens: ${this.session.tokensSoFar}/${this.session.maxTokens} (${this.session.tokensLeft} left)`);
      
      const end = Date.now();
      console.log(`Bot response generated in ${(end - start) / 1000} seconds`);
    } catch (error) {
      console.error("Bot streaming response failed:", error);
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

export const botAIWrapper = new BotAIWrapper();