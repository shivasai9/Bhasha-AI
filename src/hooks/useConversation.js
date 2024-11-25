//@ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { SPEECH_VOICE_CONFIG } from '../lib/constants';
import aiConversationService from '../lib/aiConversation.service';
import { CONVERSATION_MESSAGES } from '../constants/conversationMessages';

export function useConversation() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(1);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [showVolumeMenu, setShowVolumeMenu] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isVoicesLoading, setIsVoicesLoading] = useState(true);
  const isVoicesReady = useRef(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPromptType, setCurrentPromptType] = useState('OPEN_ENDED');
  const [tokenInfo, setTokenInfo] = useState({ left: 4096, total: 4096 });
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const recognition = useRef(null);
  const synthesis = useRef(window.speechSynthesis);
  const currentUtterance = useRef(null);
  const volumeRef = useRef(null);
  const voiceRef = useRef(null);
  const micRef = useRef(null);
  const messagesEndRef = useRef(null);

  const volumeOptions = [
    { value: 1, label: "100%" },
    { value: 0.75, label: "75%" },
    { value: 0.5, label: "50%" },
    { value: 0.25, label: "25%" },
    { value: 0, label: "Mute" },
  ];

  const getVolumeIcon = () => {
    if (volume === 0) return "VolumeX";
    if (volume < 0.3) return "Volume";
    if (volume < 0.7) return "Volume1";
    return "Volume2";
  };

  const toggleVolumeMenu = () => setShowVolumeMenu(!showVolumeMenu);
  const toggleVoiceMenu = () => setShowVoiceMenu(!showVoiceMenu);
  const handleTooltip = (name) => !showVolumeMenu && setActiveTooltip(name);
  const clearTooltip = () => setActiveTooltip(null);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    let isSubscribed = true; // Add subscription flag

    const loadVoices = async () => {
      setIsVoicesLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const voices = synthesis.current.getVoices();
        const englishVoices = voices.filter(voice => 
          SPEECH_VOICE_CONFIG.english.voicePattern.test(voice.lang)
        );

        if (englishVoices.length === 0 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadVoices, 500);
          return;
        }

        if (isSubscribed) {
          setAvailableVoices(englishVoices);
          if (englishVoices.length > 0) {
            setSelectedVoice(englishVoices[0]);
            isVoicesReady.current = true; // Mark voices as ready
          }
        }
      } finally {
        if (isSubscribed) {
          setIsVoicesLoading(false);
        }
      }
    };

    if (typeof speechSynthesis !== 'undefined') {
      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVoicesReady.current) return;

    if ("webkitSpeechRecognition" in window) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");

        setStreamingText(transcript);
        setIsStreaming(true);
        scrollToBottom();

        if (event.results[0].isFinal) {
          setStreamingText("");
          setIsStreaming(false);
          addMessage("user", transcript);
          askAI(transcript);
          recognition.current.stop();
          setIsListening(false);
        }
      };

      recognition.current.onend = () => {
        setStreamingText("");
        setIsStreaming(false);
        setIsListening(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      stopSpeaking();
    };
  }, [selectedVoice]);

  useEffect(() => {
    const initialize = async () => {
      if (!isVoicesReady.current) return;
      
      await aiConversationService.initializeSession();
      const initialMessage = CONVERSATION_MESSAGES.openEnded.initial;
      const messageId = Date.now().toString();
      initialMessage.id = messageId;
      setMessages([initialMessage]);
      
      if (availableVoices.length > 0) {
        speak(initialMessage.content, messageId, true);
      }
    };

    initialize();

    return () => {
      aiConversationService.destroy();
    };
  }, [selectedVoice]);

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, { 
      id: Date.now().toString(),
      type, 
      content, 
      timestamp: new Date() 
    }]);
    scrollToBottom();
  };

  const askAI = async (userMessage) => {
    if (isSessionExpired || isLoading) return;
    setIsLoading(true);
    setIsStreaming(false);
    try {
      let isFirstChunk = true;
      let previousChunkLength = 0;
      
      await aiConversationService.sendStreamingMessage(
        userMessage,
        (chunk) => {
          if (isFirstChunk) {
            const responseId = Date.now().toString();
            setMessages(prev => [...prev, {
              id: responseId,
              type: "ai",
              content: chunk,
              timestamp: new Date()
            }]);
            isFirstChunk = false;
            setIsStreaming(true);
            setIsLoading(false);
            speak(chunk, responseId, true);
            previousChunkLength = chunk.length;
          } else {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.type === "ai") {
                const newContent = chunk.slice(previousChunkLength);
                lastMessage.content = chunk;
                if (newContent.trim()) {
                  // queueChunk(newContent, lastMessage.id);
                }
                previousChunkLength = chunk.length;
              }
              return newMessages;
            });
          }
          scrollToBottom();
        }
      );

      // Update session token info
      const session = aiConversationService.getSession();
      const tokensLeft = session?.tokensLeft || 0;
      const maxTokens = session?.maxTokens || 0;
      
      setTokenInfo({
        left: tokensLeft,
        total: maxTokens
      });
      
      if (tokensLeft < 700) {
        setIsSessionExpired(true);
      }

    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: errorId,
        type: "ai",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      scrollToBottom();
    }
  };

  const stopSpeaking = async () => {
    if (synthesis.current?.speaking) {
      synthesis.current.cancel();
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (currentUtterance.current) {
      currentUtterance.current = null;
    }
    setCurrentlyPlayingId(null);
  };

  const speak = async (text, messageId, enableMicAfter = false) => {
    if (currentlyPlayingId === messageId) {
      return;
    }
    
    stopSpeaking();

    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      currentUtterance.current = new SpeechSynthesisUtterance(text);
      
      if (!synthesis.current) {
        synthesis.current = window.speechSynthesis;
      }
      
      if (synthesis.current.paused) {
        synthesis.current.resume();
      }
      
      const currentVoice = selectedVoice || (availableVoices.length > 0 ? availableVoices[0] : null);
      
      if (currentVoice) {
        currentUtterance.current.voice = currentVoice;
      }
      
      currentUtterance.current.volume = volume;
      currentUtterance.current.rate = 1.0;
      currentUtterance.current.pitch = 1.0;
      currentUtterance.current.lang = 'en-US';

      currentUtterance.current.onstart = () => {
        console.log('Speech started');
        setCurrentlyPlayingId(messageId);
      };

      currentUtterance.current.onend = () => {
        console.log('Speech ended normally');
        setCurrentlyPlayingId(null);
        currentUtterance.current = null;
        if (enableMicAfter && recognition.current) {
          recognition.current.start();
          setIsListening(true);
        }
      };

      currentUtterance.current.onerror = (error) => {
        console.error('Speech error:', error);
        if (error.error !== 'canceled') {
          setCurrentlyPlayingId(null);
          currentUtterance.current = null;
        }
      };

      setCurrentlyPlayingId(messageId);
      synthesis.current.speak(currentUtterance.current);

    } catch (error) {
      console.error('Speak error:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (currentUtterance.current) {
      currentUtterance.current.volume = newVolume;
    }
  };

  const selectVoice = (voice) => {
    setSelectedVoice(voice);
    if (currentUtterance.current) {
      currentUtterance.current.voice = voice;
    }
  };

  const togglePlay = (messageId, text) => {
    if (currentlyPlayingId === messageId) {
      stopSpeaking();
    } else {
      speak(text, messageId, false);
    }
  };

  const createNewSession = async () => {
    setIsLoading(true);
    try {
      aiConversationService.destroy();
      await aiConversationService.initializeSession();
      setIsSessionExpired(false);
      const responseId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: responseId,
        type: "ai",
        content: "New session created! You can continue chatting.",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Failed to create new session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isListening,
    volume,
    availableVoices,
    selectedVoice,
    currentlyPlayingId,
    updateVolume,
    selectVoice,
    toggleListening,
    togglePlay,
    showVolumeMenu,
    showVoiceMenu,
    activeTooltip,
    volumeRef,
    voiceRef,
    micRef,
    messagesEndRef,
    volumeOptions,
    getVolumeIcon,
    toggleVolumeMenu,
    toggleVoiceMenu,
    handleTooltip,
    clearTooltip,
    isVoicesLoading,
    streamingText,
    isStreaming,
    scrollToBottom,
    isLoading,
    tokenInfo,
    isSessionExpired,
    createNewSession,
  };
}