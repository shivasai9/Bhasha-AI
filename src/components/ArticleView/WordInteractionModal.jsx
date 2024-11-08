import React from 'react';
import { X, Book, Languages, Save } from 'lucide-react';
import { useWordInteraction } from '../../hooks/useWordInteraction';

export default function WordInteractionModal({ word, onClose, onSave }) {
  const {
    wordDetails,
    translation,
    loading,
    targetLanguage,
    setTargetLanguage,
    handleTranslate
  } = useWordInteraction(word);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{word}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Book className="w-4 h-4" />
              <span className="font-medium">Definition</span>
            </div>
            <p className="text-gray-600">{wordDetails?.definition}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Languages className="w-4 h-4" />
              <span className="font-medium">Translation</span>
            </div>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="mb-2 p-2 border rounded-md w-full"
            >
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
            <p className="text-gray-600">{translation}</p>
          </div>

          <button
            onClick={() => onSave(word, wordDetails)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Word
          </button>
        </div>
      </div>
    </div>
  );
}