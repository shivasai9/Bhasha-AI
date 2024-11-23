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
    toggleOpen,
    toggleMinimize,
    showHoverTooltip,
    handleMouseEnter,
    handleMouseLeave,
    shouldScrollToBottom,
    setShouldScrollToBottom,
    isLoading,
    isStreaming,
  } = useChatBot(article, articleContent);

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
        toggleOpen={toggleOpen}
      />
    );
  }

  return (
    <div
      className={`fixed right-6 bottom-6 w-96 bg-white rounded-xl shadow-xl transition-all overflow-hidden ${
        isMinimized ? "h-14" : "h-[600px]"
      }`}
    >
      <ChatHeader
        isMinimized={isMinimized}
        toggleMinimize={toggleMinimize}
        toggleOpen={toggleOpen}
      />

      {!isMinimized && (
        <>
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
          />
        </>
      )}
    </div>
  );
}
