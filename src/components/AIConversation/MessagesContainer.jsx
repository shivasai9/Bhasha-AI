import React, { useEffect } from 'react';
import { PlayCircle, PauseCircle, User, Bot } from 'lucide-react';

export default function MessagesContainer({ 
  messages, 
  messagesEndRef, 
  currentlyPlayingId,
  togglePlay,
  streamingText,
  isStreaming
}) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const MessageBubble = ({ message }) => {
    const isBot = message.type === 'ai';
    const isPlaying = currentlyPlayingId === message.id;
    
    return (
      <div className={`flex items-start gap-2 ${
        message.type === "user" ? "flex-row-reverse" : "flex-row"
      }`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === "user"
            ? "bg-indigo-600"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
        }`}>
          {message.type === "user" ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div className={`max-w-[75%] p-3 rounded-lg ${
          message.type === "user"
            ? "bg-indigo-600 text-white"
            : "bg-gray-100"
        }`}>
          <div className="flex items-center gap-2">
            {isBot && (
              <button
                onClick={() => togglePlay(message.id, message.content)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                {isPlaying ? (
                  <PauseCircle className="w-5 h-5 text-indigo-600" />
                ) : (
                  <PlayCircle className="w-5 h-5 text-indigo-600" />
                )}
              </button>
            )}
            {message.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <div className="space-y-4 p-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isStreaming && streamingText && (
          <div className="flex items-start gap-2 flex-row-reverse">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="max-w-[75%] p-3 rounded-lg bg-indigo-600 text-white flex items-center gap-1">
              {streamingText}
              <span className="after:content-[''] after:animate-dots" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}