import React, { useEffect, useRef } from 'react';
import { X, Heart, Languages, BookOpen, ArrowRight } from 'lucide-react';
import { useTooltip } from '../../hooks/useTooltip';
import { useWordInteraction } from '../../hooks/useWordInteraction';
import './Tooltip.css';

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

export default function Tooltip({ 
  word = '', 
  position = { x: 0, y: 0 }, 
  onClose = () => {},
}) {
  const tooltipRef = useRef(null);
  const { tooltipStyle } = useTooltip(position, tooltipRef);
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
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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

  return (
    <div
      ref={tooltipRef}
      className="tooltip show"
      style={tooltipStyle}
    >
      <div className="tooltip-header">
        <h3 className="text-lg font-semibold">{word}</h3>
        <div className="tooltip-actions">
          <button
            onClick={handleSaveWord}
            className={`tooltip-icon-button ${isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            disabled={isSaved}
            aria-label={isSaved ? 'Saved' : 'Save word'}
          >
            <Heart className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={onClose}
            className="tooltip-icon-button text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="tooltip-content">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">Meaning</span>
          </div>
          <p className="text-sm text-gray-600">{wordDetails.definition}</p>
        </div>

        {wordDetails.synonyms?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Synonyms</h4>
            <div className="flex flex-wrap gap-2">
              {wordDetails.synonyms.map((syn, index) => (
                <span key={index} className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {syn}
                </span>
              ))}
            </div>
          </div>
        )}

        {wordDetails.antonyms?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Antonyms</h4>
            <div className="flex flex-wrap gap-2">
              {wordDetails.antonyms.map((ant, index) => (
                <span key={index} className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {ant}
                </span>
              ))}
            </div>
          </div>
        )}

        {wordDetails.example && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Example</h4>
            <p className="text-sm italic text-gray-600">"{wordDetails.example}"</p>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-gray-700 mb-2">
            <Languages className="w-4 h-4" />
            <span className="font-medium">Translate to</span>
          </div>
          <div className="flex gap-2">
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="flex-1 text-sm border rounded-md px-2 py-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleTranslate(targetLanguage)}
              disabled={loading}
              className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors text-sm disabled:opacity-50"
            >
              <ArrowRight className="w-4 h-4" />
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {translation && (
            <p className="mt-2 text-sm font-medium text-indigo-600">
              {translation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}