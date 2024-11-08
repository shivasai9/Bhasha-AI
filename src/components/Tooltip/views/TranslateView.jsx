import React from 'react';
import { Languages, ArrowRight } from 'lucide-react';

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

export default function TranslateView({ 
  targetLanguage, 
  onLanguageChange, 
  translation,
  onTranslate,
  loading 
}) {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Languages className="w-4 h-4" />
        <span className="font-medium">Translate to</span>
      </div>
      <div className="flex gap-2 mb-3">
        <select
          value={targetLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="flex-1 text-sm border rounded-md px-2 py-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <button
          onClick={onTranslate}
          disabled={loading}
          className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors text-sm disabled:opacity-50"
        >
          <ArrowRight className="w-4 h-4" />
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>
      {translation && (
        <p className="text-sm font-medium text-indigo-600">
          {translation}
        </p>
      )}
    </div>
  );
}