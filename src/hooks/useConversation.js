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
    const loadVoices = () => {
      const voices = synthesis.current.getVoices();
      const englishVoices = voices.filter(voice => 
        SPEECH_VOICE_CONFIG.english.voicePattern.test(voice.lang)
      );
      setAvailableVoices(englishVoices);
      setSelectedVoice(englishVoices[0]);
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
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");

        if (event.results[0].isFinal) {
          addMessage("user", transcript);
          simulateAIResponse(transcript);
        }
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      stopSpeaking();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, { 
      id: Date.now().toString(),
      type, 
      content, 
      timestamp: new Date() 
    }]);
  };

  const simulateAIResponse = (userMessage) => {
    setTimeout(() => {
      const responseId = Date.now().toString();
      addMessage("ai", `Response to: ${userMessage}`);
      speak(`Response to: ${userMessage}`, responseId);
    }, 1000);
  };

  const stopSpeaking = () => {
    if (synthesis.current.speaking) {
      synthesis.current.cancel();
    }
    if (currentUtterance.current) {
      currentUtterance.current = null;
    }
    setCurrentlyPlayingId(null);
  };

  const speak = (text, messageId) => {
    if (currentlyPlayingId === messageId) {
      return; // Don't restart same message
    }
    
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.volume = volume;

    utterance.onend = () => {
      setCurrentlyPlayingId(null);
      currentUtterance.current = null;
    };

    utterance.onerror = () => {
      setCurrentlyPlayingId(null);
      currentUtterance.current = null;
    };

    currentUtterance.current = utterance;
    setCurrentlyPlayingId(messageId);
    synthesis.current.speak(utterance);
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
      speak(text, messageId);
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
    clearTooltip
  };
}