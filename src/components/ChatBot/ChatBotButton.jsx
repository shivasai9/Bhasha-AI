
import React from 'react';
import { Bot, X } from 'lucide-react';

const ChatBotButton = ({ 
  showTooltip, 
  showHoverTooltip, 
  setShowTooltip, 
  handleMouseEnter, 
  handleMouseLeave, 
  toggleOpen 
}) => {
  return (
    <div
      className="fixed bottom-6 right-6 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {(showTooltip || showHoverTooltip) && (
        <div className="absolute bottom-full right-0 mb-2">
          <div className="bg-white text-gray-800 text-sm py-2.5 px-4 rounded-xl shadow-lg whitespace-nowrap flex items-center gap-3 border border-gray-100">
            <span className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                <Bot className="w-4 h-4 text-white" />
              </div>
              Need help understanding the article?
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 right-4 w-2 h-2 -mb-1 rotate-45 bg-white border-r border-b border-gray-100"></div>
          </div>
        </div>
      )}
      <button
        onClick={toggleOpen}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <Bot className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatBotButton;