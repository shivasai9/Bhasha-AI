import React, { useState } from 'react';
import DifficultyModal from './DifficultyModal';
import { BookOpen } from 'lucide-react';
import PlaceholderImage from './PlaceholderImage';

const presetDifficulties = [
  { 
    id: 'easy', 
    label: 'Easy',
    className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
  },
  { 
    id: 'medium', 
    label: 'Medium',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  },
  { 
    id: 'hard', 
    label: 'Hard',
    className: 'bg-rose-100 text-rose-700 hover:bg-rose-200'
  }
];

export default function ArticleCard({ article, onDifficultySelect, disabled }) {
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const getThumbnailUrl = (keywords) => {
    return "https://www.levelify.me/_next/image?url=https%3A%2F%2Fik.imagekit.io%2Fko3vczxvh%2Ftr%3Aw-auto%2Cfo-auto%2FheroImage.png&w=1920&q=75";
  };

  const handlePresetDifficulty = (difficulty) => {
    onDifficultySelect(article.articleID, difficulty);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden flex h-[240px] ${
      disabled ? 'opacity-70' : ''
    }`}>
      <div className="w-1/3 relative">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>
      <div className="w-2/3 p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{article.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">{article.summary}</p>
        
        <div className="flex items-center gap-3 mt-auto">
          {presetDifficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handlePresetDifficulty(difficulty)}
              disabled={disabled}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                difficulty.className
              } ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
            >
              {difficulty.label}
            </button>
          ))}
          
          <span className="text-sm text-gray-500">or</span>
          
          <button
            onClick={() => setShowDifficultyModal(true)}
            disabled={disabled}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors flex items-center font-medium ${
              disabled ? 'cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Custom Level
          </button>
        </div>
      </div>

      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)}
          onSubmit={(difficulty) => onDifficultySelect(article.articleID, difficulty)}
        />
      )}
    </div>
  );
}