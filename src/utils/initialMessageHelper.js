//@ts-nocheck
import { CONVERSATION_TYPES } from '../lib/constants';
import aiConversationService from '../lib/aiConversation.service';
import { getRandomSubtopicsFromUserInterests } from '../lib/utils';

export const getInitialMessage = async (type, option) => {
  let prompt;
  
  switch (type) {
    case CONVERSATION_TYPES.GRAMMAR:
      prompt = `Respond with:
1. A brief greeting
2. Introduce yourself as a language practice partner
3. Mention that we'll focus on "${option}" grammar
4. Suggest practicing with one of these topics: ${getRandomSubtopicsFromUserInterests()[0]}
5. Ask if they'd prefer a different topic

Keep the entire response under 3 sentences.`;
      break;
    case CONVERSATION_TYPES.PERSONAL:
      prompt = `Respond with:
1. A warm greeting
2. Introduce yourself as a conversation partner
3. Express interest in discussing "${option}"
4. Ask a specific question about their experience with ${option}
5. Mention they can change topics if they prefer

Keep the entire response under 3 sentences.`;
      break;
    case CONVERSATION_TYPES.TOPICS:
      prompt = `Respond with:
1. A friendly greeting
2. Brief introduction as an English practice partner
3. Mention you'd love to discuss "${option}"
4. Ask one engaging question about ${option}
5. Note they can explore other topics too

Keep the entire response under 3 sentences.`;
      break;
    case CONVERSATION_TYPES.SCENARIOS:
      prompt = `Respond with:
1. A welcoming greeting
2. Quick introduction as a practice partner
3. Set up the "${option}" scenario briefly
4. Start with an in-scenario question
5. Note they can change the scenario if desired

Keep the entire response under 3 sentences.`;
      break;
    default:
      const randomTopic = getRandomSubtopicsFromUserInterests()[0];
      prompt = `Respond with:
1. A friendly greeting
2. Brief introduction as a conversation partner
3. Suggest discussing "${randomTopic}"
4. Ask one engaging question about this topic
5. Mention they can choose any other topic too

Keep the entire response under 3 sentences.`;
  }

  return await aiConversationService.sendMessage(prompt);
};