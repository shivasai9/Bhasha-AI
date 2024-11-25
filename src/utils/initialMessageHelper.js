//@ts-nocheck
import { CONVERSATION_TYPES } from '../lib/constants';
import aiConversationService from '../lib/aiConversation.service';
import { getRandomSubtopicsFromUserInterests } from '../lib/utils';

export const getInitialMessage = async (type, option) => {
  const commonInstructions = `Important: Do not use phrases like "my name is" or introduce yourself with a name. Simply state your role.
Keep the entire response under 3 sentences.`;

  let prompt;
  
  switch (type) {
    case CONVERSATION_TYPES.GRAMMAR:
      prompt = `Respond with:
1. A brief greeting
2. Simply state: "I'm your AI language tutor"
3. Mention that we'll focus on "${option}" grammar
4. Suggest practicing with one of these topics: ${getRandomSubtopicsFromUserInterests()[0]}
5. Ask if they'd prefer a different topic

${commonInstructions}`;
      break;
    case CONVERSATION_TYPES.PERSONAL:
      prompt = `Respond with:
1. A warm greeting
2. Simply state: "I'm your AI English language trainer"
3. Express interest in discussing "${option}"
4. Ask a specific question about their experience with ${option}
5. Mention they can change topics if they prefer

${commonInstructions}`;
      break;
    case CONVERSATION_TYPES.TOPICS:
      prompt = `Respond with:
1. A friendly greeting
2. Simply state: "I'm your AI conversation guide"
3. Mention you'd love to discuss "${option}"
4. Ask one engaging question about ${option}
5. Note they can explore other topics too

${commonInstructions}`;
      break;
    case CONVERSATION_TYPES.SCENARIOS:
      prompt = `Respond with:
1. A welcoming greeting
2. Simply state: "I'm your AI language practice assistant"
3. Set up the "${option}" scenario briefly
4. Start with an in-scenario question
5. Note they can change the scenario if desired

${commonInstructions}`;
      break;
    default:
      const randomTopic = getRandomSubtopicsFromUserInterests()[0];
      prompt = `Respond with:
1. A friendly greeting
2. Simply state: "I'm your AI English conversation tutor"
3. Suggest discussing "${randomTopic}"
4. Ask one engaging question about this topic
5. Mention they can choose any other topic too

${commonInstructions}`;
  }

  return await aiConversationService.sendMessage(prompt);
};