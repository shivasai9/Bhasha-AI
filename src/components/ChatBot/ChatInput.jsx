
import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ inputMessage, setInputMessage, handleSubmit, isLoading }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about the article..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`p-2 bg-indigo-600 text-white rounded-lg ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;