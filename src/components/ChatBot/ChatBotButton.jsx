import React from 'react';
import { X } from 'lucide-react';
import Logo from '../Logo';

const ChatBotButton = ({ 
  showTooltip, 
  setShowTooltip, 
  handleMouseEnter, 
  handleMouseLeave, 
  toggleOpen 
}) => {

  const handleTooltipClose = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 right-6">
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2">
          <div className="bg-white text-gray-800 text-sm py-3 px-5 rounded-xl shadow-lg flex items-start gap-4 border border-gray-100 min-w-[300px]">
            <div className="flex flex-col flex-1 gap-1">
              <span className="font-medium">Hi, I'm Article Buddy, your AI assistant.</span>
              <span>Ask me anything about the article! 👋</span>
            </div>
            <button
              onClick={handleTooltipClose}
              className="flex-shrink-0 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-0 right-4 w-2 h-2 -mb-1 rotate-45 bg-white border-r border-b border-gray-100"></div>
          </div>
        </div>
      )}
      <button
        onClick={toggleOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <Logo variant="white" width={32} height={32} strokeWidth={5} />
      </button>
    </div>
  );
};

export default ChatBotButton;