import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingDots from './LoadingDots';
import StreamingLoader from "./StreamingLoader";

const ChatMessages = ({ 
  messages, 
  handleOptionClick, 
  isLoading, 
  isStreaming,
  messagesEndRef 
}) => {
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

  return (
    <div className="h-[calc(100%-165px)] overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start gap-2 ${
            message.type === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === "user"
                ? "bg-indigo-600"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
            }`}
          >
            {message.type === "user" ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>
          <div
            className={`max-w-[75%] p-3 rounded-lg ${
              message.type === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {message.type === "user" ? (
              <p>{message.content}</p>
            ) : (
                renderMessageContent(message.content)
            )}
            {message.options && (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors flex items-center gap-1 shadow-sm hover:shadow"
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && !isStreaming && (
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="max-w-[75%] bg-gray-100 rounded-lg">
            <LoadingDots />
          </div>
        </div>
      )}
      {isStreaming && <StreamingLoader />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;