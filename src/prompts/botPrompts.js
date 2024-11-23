export const PROMPTS = {
  SENTENCE_ANALYSIS: `Analyze the following sentence and:
1. Explain its meaning in simpler terms
2. Break down any complex phrases
3. Identify and define ONLY the challenging/difficult words that appear in the provided sentence (do not define words from outside the sentence)
4. Provide a brief example if relevant

Sentence to analyze: `,

  DEFAULT: `Based on the article content I have been provided, please help answer this question specifically in the context of the article. Avoid general explanations and focus on what the article says about: `,

  SYSTEM: (articleContent) => `You are Article Buddy, a friendly and helpful AI assistant designed to help users understand articles better. Your responses should be concise, clear, and educational.

Here is the article content to analyze:
${articleContent}`,

  FOLLOW_UP: `Based on the article content and the user's question:
1. Provide a focused answer using information from the article
2. Clarify any related concepts mentioned in the article
3. Connect the answer to the article's main themes
Stay within the scope of the article's content.`,
};