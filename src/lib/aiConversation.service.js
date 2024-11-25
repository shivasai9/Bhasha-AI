import { botAIWrapper } from './botAi';
import { CONVERSATION_PROMPTS } from '../prompts/botConversationPrompts';
import { CONVERSATION_TYPES } from './constants';

class AIConversationService {
  constructor() {
    this.isInitialized = false;
    this.currentPromptType = null;
    this.currentTopic = null;
  }

  async initializeSession(conversationType = 'OPEN_ENDED', topic = '') {
    try {
      this.currentPromptType = conversationType;
      this.currentTopic = topic;

      let systemPrompt = CONVERSATION_PROMPTS.SYSTEM;

      switch (conversationType) {
        case CONVERSATION_TYPES.GRAMMAR:
          systemPrompt += CONVERSATION_PROMPTS.GRAMMAR_EXTENSION(topic);
          break;
        case CONVERSATION_TYPES.SCENARIOS:
          systemPrompt += CONVERSATION_PROMPTS.SCENARIO_EXTENSION(topic);
          break;
        case CONVERSATION_TYPES.TOPICS:
          systemPrompt += CONVERSATION_PROMPTS.TOPIC_EXTENSION(topic);
          break;
        case CONVERSATION_TYPES.PERSONAL:
          systemPrompt += CONVERSATION_PROMPTS.TOPIC_EXTENSION(topic);
          break;
        default:
          systemPrompt += CONVERSATION_PROMPTS.OPEN_ENDED_EXTENSION;
      }

      const session = await botAIWrapper.initializeBotSession(systemPrompt);
      
      if (session) {
        this.isInitialized = true;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
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