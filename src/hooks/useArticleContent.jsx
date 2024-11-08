import React, { useState, useCallback, useRef } from 'react';
import Tooltip from '../components/Tooltip';

export function useArticleContent() {
  const [tooltipData, setTooltipData] = useState(null);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const triggerRef = useRef(null);

  const handleWordClick = useCallback((word, event) => {
    event.preventDefault();
    const cleanWord = word.replace(/[.,!?]$/, '');
    
    // Store reference to clicked element
    triggerRef.current = event.target;
    setHighlightedWord(cleanWord);
    setTooltipData({
      word: cleanWord,
      position: { 
        x: event.clientX,
        y: event.clientY
      },
      content: {
        definition: `Sample definition for "${cleanWord}"`,
        example: `Here's a sample sentence using "${cleanWord}".`,
        translation: `Translation of "${cleanWord}" in target language`
      }
    });
  }, []);

  const closeTooltip = useCallback(() => {
    setTooltipData(null);
    setHighlightedWord(null);
    triggerRef.current = null;
  }, []);

  const handleSaveWord = useCallback((word, details) => {
    console.log('Saving word:', word, details);
  }, []);

  const getClickableText = (content) => {
    if (!content) return null;

    return content.split(' ').map((word, index, array) => {
      const cleanWord = word.replace(/[.,!?]$/, '');
      const isHighlighted = cleanWord === highlightedWord;
      
      return (
        <React.Fragment key={index}>
          <span
            onClick={(e) => handleWordClick(word, e)}
            className={`cursor-pointer inline-block ${
              isHighlighted 
                ? 'bg-yellow-200' 
                : 'hover:bg-yellow-100'
            }`}
          >
            {word}
          </span>
          {index < array.length - 1 ? ' ' : ''}
        </React.Fragment>
      );
    });
  };

  const tooltipElement = tooltipData && (
    <Tooltip
      word={tooltipData.word}
      content={tooltipData.content}
      position={tooltipData.position}
      onClose={closeTooltip}
      onSave={handleSaveWord}
      triggerRef={triggerRef}
    />
  );

  return { 
    getClickableText,
    tooltipElement
  };
}