//@ts-nocheck
import { CONVERSATION_TYPES } from '../lib/constants';
import aiConversationService from '../lib/aiConversation.service';

export const getInitialMessage = async (type, option) => {
  let prompt;
  
  switch (type) {
    case CONVERSATION_TYPES.GRAMMAR:
      prompt = `As a language tutor, welcome the user and start a conversation about practicing "${option}" grammar. Keep it brief and encouraging.`;
      break;
    case CONVERSATION_TYPES.PERSONAL:
      prompt = `As a conversation partner, welcome the user and start a conversation about "${option}". Ask an engaging question to begin the discussion.`;
      break;
    case CONVERSATION_TYPES.TOPICS:
      prompt = `As an English practice assistant, welcome the user and start an engaging conversation about "${option}". Ask a thought-provoking question to begin.`;
      break;
    case CONVERSATION_TYPES.SCENARIOS:
      prompt = `As a language practice partner, welcome the user and set up a roleplay scenario for "${option}". Explain the context briefly and start the scenario.`;
      break;
    default:
      prompt = "As a language conversation partner, give a friendly welcome and invite the user to chat about any topic they'd like.";
  }

  return await aiConversationService.sendMessage(prompt);
};