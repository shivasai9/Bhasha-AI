//@ts-nocheck
import React, { useRef } from 'react';
import { Send } from 'lucide-react';

const INITIAL_HEIGHT = '56px';

const ChatInput = ({ inputMessage, setInputMessage, handleSubmit, isLoading }) => {
  const textareaRef = useRef(null);

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = INITIAL_HEIGHT;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = INITIAL_HEIGHT;
    const shouldExpand = textarea.value.length > 0;
    
    if (shouldExpand) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const onSubmit = (e) => {
    handleSubmit(e);
    resetHeight();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t"
    >
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          rows="1"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Ask me anything about the article... (Shift+Enter for new line)"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-hidden max-h-32 placeholder:text-sm"
          disabled={isLoading}
          style={{ 
            height: INITIAL_HEIGHT,
            lineHeight: '1.5' 
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`p-2 bg-indigo-600 text-white rounded-lg self-end ${
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