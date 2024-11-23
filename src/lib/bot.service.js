import { botAIWrapper } from './botAi';
import { PROMPTS } from '../prompts/botPrompts';

class BotService {
  constructor() {
    this.articleContent = null;
    this.isInitialized = false;
  }

  setArticleContent(content) {
    if (this.articleContent !== content) {
      botAIWrapper.destroy();
      this.articleContent = content;
      this.isInitialized = false;
    }
  }

  async initializeSession() {
    if (!this.articleContent) {
      throw new Error('Article content must be set before initializing session');
    }

    if (this.isInitialized) {
      return true;
    }

    const session = await botAIWrapper.initializeBotSession(this.articleContent);
    if (session) {
      this.isInitialized = true;
      return true;
    }
    return false;
  }

  async sendMessage(message) {
    try {
      if (!this.isInitialized) {
        console.log('Initializing bot session...');
        await this.initializeSession();
      }

      const response = await botAIWrapper.askBot(message);
      
      if (botAIWrapper.session?.tokensLeft < 1000) {
        console.log('Token limit approaching, will initialize new session on next message');
        this.isInitialized = false;
      }

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  _getPromptByType(message, promptType) {
    switch (promptType) {
      case 'SENTENCE_ANALYSIS':
        return `${PROMPTS.SENTENCE_ANALYSIS}${message}`;
      case 'DEFAULT':
      default:
        return `${PROMPTS.DEFAULT}${message}`;
    }
  }

  async sendStreamingMessage(message, onChunk, promptType = 'DEFAULT') {
    try {
      if (!this.isInitialized) {
        console.log('Initializing bot session...');
        await this.initializeSession();
      }

      const prompt = this._getPromptByType(message, promptType);
      await botAIWrapper.askBotStream(prompt, onChunk);
      
      if (botAIWrapper.session?.tokensLeft < 1000) {
        console.log('Token limit approaching, will initialize new session on next message');
        this.isInitialized = false;
      }

    } catch (error) {
      console.error('Error sending streaming message:', error);
      this.isInitialized = false;
      throw error;
    }
  }
}

const botService = new BotService();
export default botService;
