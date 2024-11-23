import React, { useRef, useEffect } from "react";
import { useChatBot } from "../../hooks/useChatBot";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import ChatBotButton from "./ChatBotButton";
import ChatMessages from "./ChatMessages";

export default function ChatBot({ article, articleContent }) {
  const {
    isOpen,
    messages,
    inputMessage,
    isMinimized,
    showTooltip,
    setShowTooltip,
    handleSubmit,
    handleOptionClick,
    setInputMessage,
    toggleOpen: originalToggleOpen,
    toggleMinimize: originalToggleMinimize,
    showHoverTooltip,
    handleMouseEnter,
    handleMouseLeave,
    shouldScrollToBottom,
    setShouldScrollToBottom,
    isLoading,
    isStreaming,
    tokenInfo,
    isSessionExpired,
    createNewSession,
  } = useChatBot(article, articleContent);

  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleResize = () => setIsExpanded(prev => !prev);

  const handleMinimize = () => {
    if (!isMinimized) {
      setIsExpanded(false);
    }
    originalToggleMinimize();
  };

  const handleClose = () => {
    setIsExpanded(false);
    originalToggleOpen();
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  if (!isOpen) {
    return (
      <ChatBotButton
        showTooltip={showTooltip}
        showHoverTooltip={showHoverTooltip}
        setShowTooltip={setShowTooltip}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        toggleOpen={originalToggleOpen}
      />
    );
  }

  return (
    <div
      className={`fixed right-6 bottom-6 bg-white rounded-xl shadow-xl transition-all overflow-hidden ${
        isMinimized 
          ? "h-14 w-80"
          : isExpanded 
            ? "h-[80vh] w-[50vw]" 
            : "h-[600px] w-96"
      }`}
    >
      <ChatHeader
        isMinimized={isMinimized}
        toggleMinimize={handleMinimize}
        toggleOpen={handleClose}
        isExpanded={isExpanded}
        toggleResize={toggleResize}
      />

      {!isMinimized && (
        <>
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
            <div className="text-xs text-gray-600 font-medium">
              Tokens remaining: {tokenInfo.left}/{tokenInfo.total}
            </div>
            {isSessionExpired && (
              <button
                onClick={createNewSession}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                disabled={isLoading}
              >
                Create New Session
              </button>
            )}
          </div>
          <ChatMessages
            messages={messages}
            handleOptionClick={handleOptionClick}
            isLoading={isLoading}
            isStreaming={isStreaming}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={isSessionExpired || isLoading || isStreaming}
          />
        </>
      )}
    </div>
  );
}
