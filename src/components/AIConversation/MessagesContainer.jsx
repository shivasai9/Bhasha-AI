import React, { useEffect } from 'react';
import { PlayCircle, PauseCircle, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const renderMessageContent = (content) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code className="bg-gray-200 px-1 rounded" {...props} />
            ) : (
              <code className="block bg-gray-200 p-2 rounded mb-2" {...props} />
            ),
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-bold mb-2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-2" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

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
          {message.isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
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
              {isBot ? (
                <div className="prose dark:prose-invert max-w-none">
                  {renderMessageContent(message.content)}
                </div>
              ) : (
                message.content
              )}
            </div>
          )}
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