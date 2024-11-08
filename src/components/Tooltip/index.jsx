import React, { useState, useEffect, useRef } from 'react';
import { X, Heart } from 'lucide-react';
import { useTooltip } from '../../hooks/useTooltip';
import { useWordInteraction } from '../../hooks/useWordInteraction';
import TooltipOptions from './TooltipOptions';
import MeaningView from './views/MeaningView';
import SynonymsView from './views/SynonymsView';
import AntonymsView from './views/AntonymsView';
import ExampleView from './views/ExampleView';
import TranslateView from './views/TranslateView';
import AllView from './views/AllView';
import './Tooltip.css';

const options = [
  'meaning',
  'synonyms',
  'antonyms',
  'example',
  'translate',
  'all'
];

export default function Tooltip({ 
  word = '', 
  position = { x: 0, y: 0 }, 
  onClose = () => {},
  triggerRef = null
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const tooltipRef = useRef(null);
  const { tooltipStyle } = useTooltip(position, tooltipRef, triggerRef);
  const {
    wordDetails,
    translation,
    loading,
    targetLanguage,
    setTargetLanguage,
    handleTranslate,
    handleSaveWord,
    isSaved,
  } = useWordInteraction(word);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) && 
          (!triggerRef?.current || !triggerRef.current.contains(event.target))) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, triggerRef]);

  if (!wordDetails || loading) {
    return (
      <div
        ref={tooltipRef}
        className="tooltip show"
        style={tooltipStyle}
      >
        <div className="p-4 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!selectedOption) {
      return <TooltipOptions onSelect={setSelectedOption} />;
    }

    switch (selectedOption) {
      case 'meaning':
        return <MeaningView definition={wordDetails.definition} />;
      case 'synonyms':
        return <SynonymsView synonyms={wordDetails.synonyms} />;
      case 'antonyms':
        return <AntonymsView antonyms={wordDetails.antonyms} />;
      case 'example':
        return <ExampleView example={wordDetails.example} />;
      case 'translate':
        return (
          <TranslateView
            targetLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
            translation={translation}
            onTranslate={handleTranslate}
            loading={loading}
          />
        );
      case 'all':
        return (
          <AllView
            wordDetails={{ ...wordDetails, word }}
            targetLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
            translation={translation}
            onTranslate={handleTranslate}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={tooltipRef}
      className="tooltip show"
      style={tooltipStyle}
    >
      <div className="tooltip-header">
        <h3 className="text-lg font-semibold">{word}</h3>
        <div className="tooltip-actions">
          {selectedOption && (
            <button
              onClick={() => setSelectedOption(null)}
              className="tooltip-icon-button text-gray-400 hover:text-gray-600"
            >
              Back
            </button>
          )}
          <button
            onClick={handleSaveWord}
            className={`tooltip-icon-button ${
              isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={isSaved ? 'Saved' : 'Save word'}
          >
            <Heart className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onClose}
            className="tooltip-icon-button text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="tooltip-content">
        {renderContent()}
      </div>
    </div>
  );
}