import React, { useState } from "react";
import { Languages, ArrowRight, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../../../lib/constants";
import { translateContent } from "../../../lib/translation.service";
import { getLanguage } from "../../../lib/languageStorage";

export default function TranslateView({ loading, selectedText }) {
  const currentLanguage = getLanguage();
  const availableLanguages = LANGUAGES.filter(
    (lang) => lang.name.toLowerCase() !== currentLanguage
  );
  const [targetLanguage, setTargetLanguage] = useState(availableLanguages[0].name.toLowerCase());
  const [translation, setTranslation] = useState(null);
  const [error, setError] = useState(null);



  const handleTranslate = async () => {
    try {
      setError(null);
      console.log("Translating:", selectedText);
      console.log("From:", currentLanguage);
      console.log("To:", targetLanguage);
      const translatedText = await translateContent(
        selectedText,
        currentLanguage,
        targetLanguage
      );
      setTranslation(translatedText);
    } catch (error) {
      console.error("Translation failed:", error);
      setError("Something went wrong. Please try again.");
      setTranslation(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <Languages className="w-4 h-4" />
        <span className="font-medium">Translate to</span>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full appearance-none text-sm border border-gray-300 rounded-lg px-3 py-2 
              bg-white shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 
              focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer
              pr-10"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.name.toLowerCase()}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg
          hover:bg-indigo-700 active:bg-indigo-800 shadow-sm
          disabled:bg-indigo-300 transition-all duration-200 text-sm font-medium"
        >
          <ArrowRight className="w-4 h-4" />
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>
      {error ? (
        <div className="flex items-center justify-between text-sm text-red-600 mt-2">
          <span>{error}</span>
        </div>
      ) : translation && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1.5">Translation:</div>
          <div className="bg-white border border-indigo-100 rounded-lg p-3
            shadow-sm animate-fadeIn relative overflow-hidden group"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500" />
            <p className="text-sm text-gray-800 font-medium leading-relaxed pl-3">
              {translation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
