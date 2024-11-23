
import React from 'react';
import { Bot, X, Maximize2, Minimize2 } from 'lucide-react';

const ChatHeader = ({ isMinimized, toggleMinimize, toggleOpen }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-between p-4">
      <div className="flex items-center space-x-3">
        <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-medium text-white">Article Buddy</h3>
      </div>
      <div className="flex gap-2">
        <button
          onClick={toggleMinimize}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMinimized ? (
            <Maximize2 className="w-4 h-4 text-white" />
          ) : (
            <Minimize2 className="w-4 h-4 text-white" />
          )}
        </button>
        <button
          onClick={toggleOpen}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;