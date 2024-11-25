export const BOT_MESSAGES = {
  initial: (articleTitle) => ({
    type: "bot",
    content: `👋 Hi! I'm Article Buddy, your friendly reading companion. I see you're reading "${articleTitle || 'this article'}". How can I help you understand it better?`,
    options: [
      { id: 'difficult-sentences', name: "🤔 Difficult sentences" },
      { id: 'main-ideas', name: "💡 Main ideas" },
      { id: 'key-terms', name: "📚 Key terms" },
      { id: 'other', name: "✨ Other" },
    ],
  }),

  paragraphExplanation: (inputMessage) => ({
    type: "bot",
    content: `Let me help you understand this paragraph better. Here's a simpler explanation:\n\n"${inputMessage}"\n\nWould you like me to:\n`,
    options: [
      { id: 'simple-terms', name: "📝 Explain it in simpler terms" },
      { id: 'sentence-breakdown', name: "🔍 Break it down sentence by sentence" },
      { id: 'key-points', name: "💡 Highlight key points" },
    ],
  }),

  difficultParagraphPrompt: {
    type: "bot",
    content: "Of course! I'll help you break down any confusing parts of the article. Just copy and paste the sentence you'd like to understand better, and I'll explain it in a clearer way. You can select any part of the text from the article above.",
    options: undefined
  },

  generalResponse: (inputMessage, articleTitle) => ({
    type: "bot",
    content: `I understand you're asking about: ${inputMessage}. Let me help you understand the article "${articleTitle || 'this article'}" better.`,
    options: undefined,
  }),

  followUpPrompt: {
    type: "bot",
    content: "Feel free to ask any questions you have about the article. I'm here to help clarify and deepen your understanding.",
    options: undefined
  },

  whatsNext: {
    type: "bot",
    content: "What would you like to know next?",
    options: [
      { id: 'difficult-sentences', name: "🤔 Difficult sentences" },
      { id: 'main-ideas', name: "💡 Main ideas" },
      { id: 'key-terms', name: "📚 Key terms" },
      { id: 'follow-up', name: "❓ Ask follow-up questions" },
      { id: 'other', name: "✨ Other" },
    ],
  },
};