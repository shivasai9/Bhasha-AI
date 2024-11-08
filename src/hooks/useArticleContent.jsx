import React, { useState, useCallback } from 'react';
import Tooltip from '../components/Tooltip';

export function useArticleContent() {
  const [tooltipData, setTooltipData] = useState(null);

  const handleWordClick = useCallback((word, event) => {
    event.preventDefault();
    const cleanWord = word.replace(/[.,!?]$/, '');
    
    // Mock data - in real app, this would come from the AI API
    setTooltipData({
      word: cleanWord,
      position: { x: event.clientX, y: event.clientY },
      content: {
        definition: `Sample definition for "${cleanWord}"`,
        example: `Here's a sample sentence using "${cleanWord}".`,
        translation: `Translation of "${cleanWord}" in target language`
      }
    });
  }, []);

  const closeTooltip = useCallback(() => {
    setTooltipData(null);
  }, []);

  const handleSaveWord = useCallback((word, details) => {
    // Save word logic here
    console.log('Saving word:', word, details);
  }, []);

  const getClickableText = (content) => {
    if (!content) return null;

    return content.split(' ').map((word, index, array) => (
      <React.Fragment key={index}>
        <span
          onClick={(e) => handleWordClick(word, e)}
          className="cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          {word}
        </span>
        {index < array.length - 1 ? ' ' : ''}
      </React.Fragment>
    ));
  };

  const tooltipElement = tooltipData && (
    <Tooltip
      word={tooltipData.word}
      content={tooltipData.content}
      position={tooltipData.position}
      onClose={closeTooltip}
      onSave={handleSaveWord}
    />
  );

  return { 
    getClickableText,
    tooltipElement
  };
}