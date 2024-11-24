//@ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { SPEECH_VOICE_CONFIG } from '../lib/constants';

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
          simulateAIResponse(transcript);
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

  const simulateAIResponse = (userMessage) => {
    setTimeout(() => {
      const responseId = Date.now().toString();
      addMessage("ai", `Response to: ${userMessage}`);
      speak(`Response to: ${userMessage}`, responseId, true);
    }, 1000);
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
  };
}