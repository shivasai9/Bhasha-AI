
import { botAIWrapper } from './botAi';
import { CONVERSATION_PROMPTS } from '../prompts/botConversationPrompts';

class AIConversationService {
  constructor() {
    this.isInitialized = false;
  }

  async initializeSession(conversationType = 'OPEN_ENDED', topic = '') {
    if (this.isInitialized) {
      return true;
    }

    let systemPrompt = CONVERSATION_PROMPTS.SYSTEM;
    let initialPrompt;

    switch (conversationType) {
      case 'GRAMMAR':
        initialPrompt = CONVERSATION_PROMPTS.GRAMMAR_PRACTICE(topic);
        break;
      case 'SCENARIO':
        initialPrompt = CONVERSATION_PROMPTS.SCENARIO_PRACTICE(topic);
        break;
      case 'TOPIC':
        initialPrompt = CONVERSATION_PROMPTS.TOPIC_DISCUSSION(topic);
        break;
      default:
        initialPrompt = CONVERSATION_PROMPTS.OPEN_ENDED;
    }

    const session = await botAIWrapper.initializeBotSession();
    
    if (session) {
      this.isInitialized = true;
      // Send initial prompt to set context
      await this.sendMessage(initialPrompt);
      return true;
    }
    return false;
  }

  async sendMessage(message) {
    try {
      if (!this.isInitialized) {
        console.log('Initializing conversation session...');
        await this.initializeSession();
      }

      const response = await botAIWrapper.askBot(message);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  async sendStreamingMessage(message, onChunk) {
    try {
      if (!this.isInitialized) {
        console.log('Initializing conversation session...');
        await this.initializeSession();
      }

      await botAIWrapper.askBotStream(message, onChunk);

    } catch (error) {
      console.error('Error sending streaming message:', error);
      throw error;
    }
  }

  getSession() {
    return botAIWrapper.session;
  }

  destroy() {
    botAIWrapper.destroy();
    this.isInitialized = false;
  }
}

const aiConversationService = new AIConversationService();
export default aiConversationService;