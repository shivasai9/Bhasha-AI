//@ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { SPEECH_VOICE_CONFIG } from '../lib/constants';
import aiConversationService from '../lib/aiConversation.service';
import { CONVERSATION_MESSAGES } from '../constants/conversationMessages';
import { getUniqueId, sanitizeText } from '../lib/utils';

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
    let isSubscribed = true;

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
            const defaultVoice = englishVoices.find(voice => voice.name === SPEECH_VOICE_CONFIG.english.defaultVoice);
            setSelectedVoice(defaultVoice || englishVoices[0]);
            isVoicesReady.current = true;
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
      
      if(messages && messages.length > 0) return;
      const initialId = getUniqueId();
      setMessages([{
        id: initialId,
        type: "ai",
        content: "",
        isLoading: true,
        timestamp: new Date()
      }]);
      
      await aiConversationService.initializeSession();
      const initialMessage = CONVERSATION_MESSAGES.openEnded.initial;
      
      setMessages([{
        id: initialId,
        type: "ai",
        content: initialMessage.content,
        timestamp: new Date()
      }]);
      
      if (availableVoices.length > 0) {
        speak(initialMessage.content, initialId, true);
      }
    };

    initialize();

    return () => {
      aiConversationService.destroy();
    };
  }, [selectedVoice]);

  const toggleListening = () => {
    if (isSessionExpired) return;
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
      id: getUniqueId(),
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
    
    const skeletonId = getUniqueId();
    setMessages(prev => [...prev, {
      id: skeletonId,
      type: "ai",
      content: "",
      isLoading: true,
      timestamp: new Date()
    }]);
    scrollToBottom();

    try {
      const response = await aiConversationService.sendMessage(userMessage);
      
      setMessages(prev => prev.map(msg => 
        msg.id === skeletonId ? {
          id: skeletonId,
          type: "ai",
          content: response,
          timestamp: new Date()
        } : msg
      ));

      // Update session token info
      const session = aiConversationService.getSession();
      const tokensLeft = session?.tokensLeft || 0;
      const maxTokens = session?.maxTokens || 0;
      
      setTokenInfo({
        left: tokensLeft,
        total: maxTokens
      });
      let enableMic = true;
      if (tokensLeft < 720) {
        enableMic = false;
        setIsSessionExpired(true);
      }
      speak(response, skeletonId, enableMic);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === skeletonId ? {
          id: skeletonId,
          type: "ai",
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
          timestamp: new Date()
        } : msg
      ));
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
      const sanitizedText = sanitizeText(text);
      const sentences = sanitizedText.split(/[.]/).filter(sentence => sentence.trim().length > 0);
      
      let currentIndex = 0;
      const speakNextSentence = () => {
        if (currentIndex >= sentences.length) {
          setCurrentlyPlayingId(null);
          currentUtterance.current = null;
          if (enableMicAfter && recognition.current && !isSessionExpired) {
            recognition.current.start();
            setIsListening(true);
          }
          return;
        }

        currentUtterance.current = new SpeechSynthesisUtterance(sentences[currentIndex].trim());
        
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
          setCurrentlyPlayingId(messageId);
        };

        currentUtterance.current.onend = () => {
          currentIndex++;
          speakNextSentence();
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
      };

      speakNextSentence();

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
      const responseId = getUniqueId();
      setMessages(prev => [...prev, {
        id: responseId,
        type: "ai",
        content: "A new session has been created! Feel free to continue our conversation, but please note that I've lost our previous chat.",
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