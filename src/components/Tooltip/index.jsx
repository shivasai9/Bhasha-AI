import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Volume2, ArrowLeft } from 'lucide-react';
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

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

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
        <div className="tooltip-header">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{word}</h3>
            <button
              onClick={handleSpeak}
              className="tooltip-icon-button text-gray-400 hover:text-gray-600"
              aria-label="Speak word"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <div className="tooltip-actions">
            <button
              onClick={handleSaveWord}
              className="tooltip-icon-button text-gray-400"
              disabled
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="tooltip-icon-button text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="tooltip-content p-4">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
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
        return <MeaningView definition={wordDetails.meaning} />;
      case 'synonyms':
        return <SynonymsView synonyms={wordDetails.synonyms} />;
      case 'antonyms':
        return <AntonymsView antonyms={wordDetails.antonyms} />;
      case 'example':
        return <ExampleView example={wordDetails.exampleSentence} />;
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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{word}</h3>
          <button
            onClick={handleSpeak}
            className="tooltip-icon-button text-gray-400 hover:text-gray-600"
            aria-label="Speak word"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <div className="tooltip-actions">
          {selectedOption && (
            <button
              onClick={() => setSelectedOption(null)}
              className="tooltip-icon-button text-gray-400 hover:text-gray-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
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