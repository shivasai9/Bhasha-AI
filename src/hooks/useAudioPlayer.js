import { useState, useEffect, useRef } from 'react';
import { SPEECH_VOICE_CONFIG } from '../lib/constants';
import { getLearningLanguage } from '../lib/languageStorage';

export function useAudioPlayer(text) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const speechRef = useRef(null);
  const utteranceRef = useRef(null);
  const currentPositionRef = useRef(0);
  const textRef = useRef(text);
  const wordPositionsRef = useRef([]);
  const [pausedPosition, setPausedPosition] = useState(0);

  const cancelSpeech = () => {
    if (speechRef.current) {
      setPausedPosition(currentPositionRef.current);
      speechRef.current.cancel();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
      
      const handleVisibilityChange = () => {
        if (document.hidden) {
          cancelSpeech();
        }
      };

      const handleBeforeUnload = () => {
        cancelSpeech();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const currentLanguage = getLearningLanguage();
        const langCode = SPEECH_VOICE_CONFIG[currentLanguage]?.lang || 'en-US';
        const filteredVoices = voices.filter(voice => voice.lang.startsWith(langCode.split('-')[0]));
        setAvailableVoices(filteredVoices);
        setSelectedVoice(filteredVoices[0]);
      };

      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        cancelSpeech();
      };
    }
  }, []);

  useEffect(() => {
    if (text !== textRef.current) {
      cancelSpeech();
      currentPositionRef.current = 0;
      textRef.current = text;
      
      if (text) {
        let position = 0;
        wordPositionsRef.current = text.split(/\s+/).map(word => {
          const wordStart = position;
          position += word.length + 1;
          return wordStart;
        });
      } else {
        wordPositionsRef.current = [];
      }
    }
  }, [text]);

  const findNearestWordPosition = (position) => {
    return wordPositionsRef.current.reduce((nearest, current) => {
      return Math.abs(current - position) < Math.abs(nearest - position) ? current : nearest;
    }, 0);
  };

  const setupUtterance = (startPosition = 0) => {
    if (!textRef.current?.trim()) return null;

    try {
      const wordPosition = findNearestWordPosition(startPosition);
      const remainingText = textRef.current.slice(wordPosition);
      
      const utterance = new SpeechSynthesisUtterance(remainingText);
      utterance.rate = speed;
      utterance.volume = volume;

      const currentLanguage = getLearningLanguage();
      const voiceConfig = SPEECH_VOICE_CONFIG[currentLanguage] || SPEECH_VOICE_CONFIG['english'];
      utterance.lang = voiceConfig.lang;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onboundary = (event) => {
        if (event?.charIndex != null) {
          currentPositionRef.current = wordPosition + event.charIndex;
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        currentPositionRef.current = 0;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        currentPositionRef.current = 0;
      };

      return { utterance, position: wordPosition };
    } catch (error) {
      console.error('Error setting up utterance:', error);
      return null;
    }
  };

  const startPlayback = (position = 0) => {
    if (!speechRef.current || !textRef.current?.trim()) return;

    try {
      speechRef.current.cancel();
      setIsPlaying(false);

      const setup = setupUtterance(position);
      if (!setup) return;

      utteranceRef.current = setup.utterance;
      currentPositionRef.current = setup.position;

      setTimeout(() => {
        speechRef.current.speak(utteranceRef.current);
        setIsPlaying(true);
      }, 50);
    } catch (error) {
      console.error('Error starting playback:', error);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!speechRef.current || !textRef.current) return;

    if (isPlaying) {
      cancelSpeech();
    } else {
      startPlayback(pausedPosition);
    }
  };

  const resetPlayback = () => {
    if (!speechRef.current || !textRef.current) return;

    const currentWord = findNearestWordPosition(currentPositionRef.current);
    const wordIndex = wordPositionsRef.current.indexOf(currentWord);
    const targetWordIndex = Math.max(0, wordIndex - 5);
    const newPosition = wordPositionsRef.current[targetWordIndex] || 0;
    
    cancelSpeech();
    setPausedPosition(newPosition);
    startPlayback(newPosition);
  };

  const resetToStart = () => {
    if (!speechRef.current || !textRef.current) return;
    
    cancelSpeech();
    currentPositionRef.current = 0;
    setPausedPosition(0);
    startPlayback(0);
  };

  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    if (utteranceRef.current && isPlaying) {
      const currentPos = currentPositionRef.current;
      startPlayback(currentPos);
    }
  };

  const updateVolume = (newVolume) => {
    setVolume(newVolume);
    if (utteranceRef.current && isPlaying) {
      const currentPos = currentPositionRef.current;
      startPlayback(currentPos);
    }
  };

  const selectVoice = (voice) => {
    setSelectedVoice(voice);
    if (utteranceRef.current && isPlaying) {
      const currentPos = currentPositionRef.current;
      startPlayback(currentPos);
    }
  };

  return {
    isPlaying,
    speed,
    volume,
    availableVoices,
    selectedVoice,
    togglePlay,
    resetPlayback,
    resetToStart,
    updateSpeed,
    updateVolume,
    selectVoice
  };
}