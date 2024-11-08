import React from 'react';
import { Save, Check } from 'lucide-react';

export default function SaveView({ word, onSave, isSaved }) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Save className="w-4 h-4" />
        <span className="font-medium">Save Word</span>
      </div>
      <button
        onClick={() => onSave(word)}
        disabled={isSaved}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
          isSaved
            ? 'bg-green-100 text-green-700'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isSaved ? (
          <>
            <Check className="w-4 h-4" />
            Word Saved
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Word
          </>
        )}
      </button>
    </div>
  );
}