import React, { useState, useCallback, useRef, useMemo } from 'react';
import Tooltip from '../components/Tooltip';
import { generateAndSaveSummary } from "../lib/summaryGenerator";
import { filterImageUrls } from "../lib/utils";

export function useArticleContent(article, content, selectedDifficulty) {
  const [tooltipData, setTooltipData] = useState(null);
  const [highlightedWord, setHighlightedWord] = useState(null);
  const [triggerElBoundingClientRect, setTriggerElBoundingClientRect] = useState(null);
  const triggerRef = useRef(null);

  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const articleData = useMemo(() => {
    if (!article?.imagesData) return {};
    const filteredImageData = filterImageUrls(article.imagesData);
    const firstImage = filteredImageData[0] || {};
    
    return {
      imageUrl: firstImage.url || null,
      imageAlt: firstImage.alt || article.title,
      refUrl: firstImage.refUrl || null,
    };
  }, [article]);

  const handleWordClick = useCallback((word, event) => {
    event.preventDefault();
    const cleanWord = word.replace(/[.,!?]$/, '');
    triggerRef.current = event.target;
    const boundingRect = event.target.getBoundingClientRect();
    
    setTooltipData({
      word: cleanWord,
      position: {
        x: boundingRect.left,
        y: boundingRect.bottom
      },
      content: {
        definition: `Sample definition for "${cleanWord}"`,
        example: `Here's a sample sentence using "${cleanWord}".`,
        translation: `Translation of "${cleanWord}" in target language`,
      },
    });
    setTriggerElBoundingClientRect(boundingRect);
    setHighlightedWord(cleanWord);
  }, []);

  const handleSummaryClick = useCallback(async () => {
    if (!article?.articleID || !content) return;

    setShowSummary(!showSummary);
    if (!summary) {
      setSummaryLoading(true);
      try {
        const newSummary = await generateAndSaveSummary(
          article.articleID,
          content,
          selectedDifficulty
        );
        setSummary(newSummary || 'Failed to generate summary. Please try again.');
      } catch (error) {
        setSummary('Error generating summary. Please try again.');
      } finally {
        setSummaryLoading(false);
      }
    }
  }, [article?.articleID, content, selectedDifficulty, showSummary, summary]);

  const getClickableText = useCallback((text) => {
    if (!text) return null;

    return text.split(' ').map((word, index, array) => {
      const cleanWord = word.replace(/[.,!?]$/, '');
      const isHighlighted = cleanWord === highlightedWord;
      
      return (
        <React.Fragment key={index}>
          <span
            onClick={(e) => handleWordClick(word, e)}
            className={`cursor-pointer inline-block ${
              isHighlighted ? 'bg-yellow-200' : 'hover:bg-yellow-100'
            }`}
          >
            {word}
          </span>
          {index < array.length - 1 ? ' ' : ''}
        </React.Fragment>
      );
    });
  }, [highlightedWord, handleWordClick]);

  const closeTooltip = useCallback(() => {
    setTooltipData(null);
    setHighlightedWord(null);
    triggerRef.current = null;
  }, []);

  return {
    getClickableText,
    tooltipElement: tooltipData && (
      <Tooltip
        word={tooltipData.word}
        position={tooltipData.position}
        onClose={closeTooltip}
        triggerRef={triggerRef}
        triggerElBoundingClientRect={triggerElBoundingClientRect}
      />
    ),
    showDifficultyModal,
    setShowDifficultyModal,
    showSummary,
    summary,
    summaryLoading,
    handleSummaryClick,
    articleData: {
      imageUrl: article?.imagesData?.[0]?.url,
      imageAlt: article?.title,
      refUrl: article?.imagesData?.[0]?.refUrl,
      imagesData: article?.imagesData || []
    }
  };
}
