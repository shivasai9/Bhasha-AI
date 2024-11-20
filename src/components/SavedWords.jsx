import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Book, 
  Languages, 
  Lightbulb, 
  RefreshCw,
  Shuffle,
  X
} from "lucide-react";
import { getSavedWords, updateWordStatus } from "../lib/dbUtils";
import Header from "./common/Header";
import CustomTooltip from "./ArticleView/CustomTooltip";

export default function SavedWords() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [activeWordId, setActiveWordId] = useState(null);
  const tooltipRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedWords = async () => {
      try {
        const savedWords = await getSavedWords();
        setWords(savedWords);
      } catch (error) {
        console.error("Error loading saved words:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedWords();
  }, []);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/articles");
    }
  };

  const handleUnsave = async (wordId) => {
    try {
      await updateWordStatus(wordId, false);
      setWords(words.filter(word => word.wordId !== wordId));
    } catch (error) {
      console.error("Error unsaving word:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">Loading saved words...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Your Vocabulary Collection
            </h1>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {words.length} words saved
            </span>
          </div>

          {words.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <Book className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Start saving words to build your collection!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {words.map((word) => (
                <div
                  key={word.wordId}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {word.word}
                    </h3>
                    <button
                      ref={word.wordId === activeWordId ? tooltipRef : null}
                      onClick={() => handleUnsave(word.wordId)}
                      onMouseEnter={() => {
                        setTooltipVisible(true);
                        setActiveWordId(word.wordId);
                      }}
                      onMouseLeave={() => {
                        setTooltipVisible(false);
                        setActiveWordId(null);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from saved words"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{word.meaning}</p>
                    </div>

                    {word.exampleSentence && (
                      <div className="flex items-start">
                        <Book className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                        <p className="text-gray-600 italic">"{word.exampleSentence}"</p>
                      </div>
                    )}

                    {word.synonyms && word.synonyms.length > 0 && (
                      <div className="flex items-start">
                        <RefreshCw className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Similar to: </span>
                          <span className="text-gray-700">{word.synonyms.join(", ")}</span>
                        </div>
                      </div>
                    )}

                    {word.antonyms && word.antonyms.length > 0 && (
                      <div className="flex items-start">
                        <Shuffle className="w-5 h-5 text-rose-500 mr-2 flex-shrink-0 mt-1" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Opposite to: </span>
                          <span className="text-gray-700">{word.antonyms.join(", ")}</span>
                        </div>
                      </div>
                    )}

                    {word.translations && Object.keys(word.translations).length > 0 && (
                      <div className="flex items-start">
                        <Languages className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-1" />
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(word.translations).map(([lang, trans]) => (
                            <span key={lang} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {trans} <span className="ml-1 text-indigo-500">({lang})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CustomTooltip 
        text="Unsave word"
        visible={tooltipVisible}
        containerRef={tooltipRef}
      />
    </div>
  );
}
