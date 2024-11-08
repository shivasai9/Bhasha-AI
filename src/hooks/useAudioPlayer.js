import { useState, useEffect, useRef } from 'react';

export function useAudioPlayer(text) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const speechRef = useRef(null);
  const utteranceRef = useRef(null);
  const currentPositionRef = useRef(0);
  const textRef = useRef(text);
  const wordPositionsRef = useRef([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechRef.current = window.speechSynthesis;
      return () => {
        if (speechRef.current) {
          currentPositionRef.current = 0;
          speechRef.current.cancel();
        }
      };
    }
  }, []);

  useEffect(() => {
    textRef.current = text;
    if (text) {
      let position = 0;
      wordPositionsRef.current = text.split(/\s+/).map(word => {
        const wordStart = position;
        position += word.length + 1;
        return wordStart;
      });
    }
  }, [text]);

  const findNearestWordPosition = (position) => {
    return wordPositionsRef.current.reduce((nearest, current) => {
      return Math.abs(current - position) < Math.abs(nearest - position) ? current : nearest;
    }, 0);
  };

  const setupUtterance = (startPosition = 0) => {
    if (!textRef.current) return null;

    const wordPosition = findNearestWordPosition(startPosition);
    const remainingText = textRef.current.slice(wordPosition);
    
    const utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.rate = speed;

    utterance.onboundary = (event) => {
      currentPositionRef.current = wordPosition + event.charIndex;
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        console.error('Speech synthesis error:', event);
      }
      setIsPlaying(false);
    };

    return { utterance, position: wordPosition };
  };

  const startPlayback = (position = 0) => {
    if (!speechRef.current || !textRef.current) return;

    // Cancel any ongoing speech
    speechRef.current.cancel();

    // Setup new utterance
    const setup = setupUtterance(position);
    if (!setup) return;

    utteranceRef.current = setup.utterance;
    currentPositionRef.current = setup.position;

    // Start speaking
    speechRef.current.speak(utteranceRef.current);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!speechRef.current || !textRef.current) return;

    if (isPlaying) {
      speechRef.current.cancel();
      setIsPlaying(false);
    } else {
      startPlayback(currentPositionRef.current);
    }
  };

  const resetPlayback = () => {
    if (!speechRef.current || !textRef.current) return;

    const currentWord = findNearestWordPosition(currentPositionRef.current);
    const wordIndex = wordPositionsRef.current.indexOf(currentWord);
    const targetWordIndex = Math.max(0, wordIndex - 5);
    const newPosition = wordPositionsRef.current[targetWordIndex];
    
    startPlayback(newPosition);
  };

  const resetToStart = () => {
    if (!speechRef.current || !textRef.current) return;
    
    currentPositionRef.current = 0;
    startPlayback(0);
  };

  const updateSpeed = (newSpeed) => {
    setSpeed(newSpeed);
    if (utteranceRef.current && isPlaying) {
      const currentPos = currentPositionRef.current;
      startPlayback(currentPos);
    }
  };

  return {
    isPlaying,
    speed,
    togglePlay,
    resetPlayback,
    resetToStart,
    updateSpeed
  };
}