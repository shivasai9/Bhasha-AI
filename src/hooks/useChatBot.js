import { useState, useEffect } from 'react';
import { BOT_MESSAGES } from '../constants/botMessages';
import botService from '../lib/bot.service';

export function useChatBot(article, articleContent) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showHoverTooltip, setShowHoverTooltip] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPromptType, setCurrentPromptType] = useState('DEFAULT');
  const [tokenInfo, setTokenInfo] = useState({ left: 4096, total: 4096 });
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const destroySession = () => {
    botService.destroy();
    setMessages([]);
    setTokenInfo({ left: 4096, total: 4096 });
    setIsSessionExpired(false);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
    if (article?.title) {
      setMessages([BOT_MESSAGES.initial(article.title)]);
    }
  };

  const closeChat = () => {
    destroySession();
    setIsOpen(false);
    setIsMinimized(false);
  };

  useEffect(() => {
    if (articleContent) {
      botService.setArticleContent(articleContent);
    }
  }, [articleContent]);

  const triggerScroll = () => {
    setShouldScrollToBottom(true);
  };

  const createNewSession = async () => {
    setIsLoading(true);
    try {
      botService.destroy();
      await botService.initializeSession();
      setIsSessionExpired(false);
      setMessages(prev => [...prev, {
        type: "bot",
        content: "New session created! You can continue chatting.",
        options: undefined,
      }]);
    } catch (error) {
      console.error("Failed to create new session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || isSessionExpired || isStreaming) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      options: undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    triggerScroll();
    setIsLoading(true);
    setIsStreaming(false);

    try {
      let isFirstChunk = true;
      let finalChunk = '';
      
      await botService.sendStreamingMessage(
        inputMessage, 
        (chunk) => {
          if (isFirstChunk) {
            setMessages((prev) => [...prev, {
              type: "bot",
              content: chunk,
              options: undefined,
            }]);
            isFirstChunk = false;
            finalChunk = chunk;
            setIsStreaming(true);
            setIsLoading(false);
          } else {
            setMessages((prev) => {
              const newMessages = [...prev];
              if (newMessages[newMessages.length - 1].type === "bot") {
                newMessages[newMessages.length - 1].content = chunk;
                finalChunk = chunk;
              }
              return newMessages;
            });
          }
          triggerScroll();
        },
        currentPromptType
      );

      setTimeout(() => {
        setMessages((prev) => [...prev, BOT_MESSAGES.whatsNext]);
        triggerScroll();
      }, 500);

    } catch (error) {
      console.error("Failed to get bot response:", error);
      setMessages((prev) => [...prev, {
        type: "bot",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        options: undefined,
      }]);
    } finally {
      const session = botService.getSession();
      const tokensLeft = session?.tokensLeft || 0;
      const maxTokens = session?.maxTokens || 0;
      
      setTokenInfo({
        left: tokensLeft,
        total: maxTokens
      });
      
      // Keep 700 as the minimum number of tokens to avoid session expiry
      if (tokensLeft < 700) {
        setIsSessionExpired(true);
      }
      
      setIsLoading(false);
      setIsStreaming(false);
      setCurrentPromptType('DEFAULT');
      triggerScroll();
    }
  };

  const handleOptionClick = (option) => {
    const userMessage = {
      type: "user",
      content: option.name,
      options: undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    triggerScroll();

    switch(option.id) {
      case 'difficult-sentences':
        setCurrentPromptType('SENTENCE_ANALYSIS');
        setTimeout(() => {
          setMessages((prev) => [...prev, BOT_MESSAGES.difficultParagraphPrompt]);
          triggerScroll();
        }, 1000);
        break;

      case 'follow-up':
      case 'other':
        setCurrentPromptType('FOLLOW_UP');
        setTimeout(() => {
          setMessages((prev) => [...prev, BOT_MESSAGES.followUpPrompt]);
          triggerScroll();
        }, 1000);
        break;

      default:
        setCurrentPromptType('DEFAULT');
        setMessages((prev) => [...prev, userMessage]);
    }
  };

  const toggleOpen = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const toggleMinimize = () => setIsMinimized(prev => !prev);

  const handleMouseEnter = () => !isOpen && setShowHoverTooltip(true);
  const handleMouseLeave = () => setShowHoverTooltip(false);

  return {
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
    tokenInfo,
    isSessionExpired,
    createNewSession,
    destroySession,
  };
}