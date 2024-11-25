
export const CONVERSATION_MESSAGES = {
  openEnded: {
    initial: {
      type: "ai",
      content: "👋 Hi! I'm your conversation partner. Let's have a chat about anything you'd like! Feel free to start our conversation.",
      options: [
        { id: 'introduce', name: "👋 Introduce yourself" },
        { id: 'suggest-topic', name: "💭 Get topic suggestion" },
        { id: 'free-chat', name: "🗣️ Start chatting" }
      ]
    },
    suggestTopic: {
      type: "ai",
      content: "Here are some interesting topics we could discuss:",
      options: [
        { id: 'hobbies', name: "🎨 Your hobbies and interests" },
        { id: 'travel', name: "✈️ Travel experiences" },
        { id: 'future', name: "🔮 Future plans" },
        { id: 'culture', name: "🌍 Cultural differences" }
      ]
    },
    helpPrompt: {
      type: "ai",
      content: "If you're not sure how to continue, you can:",
      options: [
        { id: 'ask-question', name: "❓ Ask me a question" },
        { id: 'change-topic', name: "🔄 Change the topic" },
        { id: 'get-feedback', name: "📝 Get language feedback" }
      ]
    }
  }
};