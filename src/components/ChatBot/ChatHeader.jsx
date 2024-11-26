import React from 'react';
import { X, Maximize2, Minimize2, Maximize } from 'lucide-react';
import Logo from '../Logo';

const ChatHeader = ({ isMinimized, toggleMinimize, toggleOpen, isExpanded, toggleResize }) => {
  return (
    <div className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-between ${
      isMinimized ? 'p-2.5' : 'p-4'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors ${
          isMinimized ? 'p-1' : 'p-1.5'
        }`}>
          <Logo variant="white" width={24} height={24} strokeWidth={5} />
        </div>
        <h3 className="font-medium text-white">Article Buddy</h3>
      </div>
      <div className="flex gap-1.5">
        {!isMinimized && (
          <button
            onClick={toggleResize}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Maximize className={`w-4 h-4 text-white ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
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