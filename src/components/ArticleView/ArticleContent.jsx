import React, { useState } from "react";
import { useArticleContent } from "../../hooks/useArticleContent";
import { ExternalLink, Gauge } from "lucide-react";
import PlaceholderImage from "../PlaceholderImage";
import { filterImageUrls } from "../../lib/utils";
import DifficultyLevelModal from './DifficultyLevelModal.jsx';

const difficultyThemes = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  hard: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  default: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
};

export default function ArticleContent({
  article,
  content,
  onWordClick,
  contentLoading,
  selectedDifficulty,
  onDifficultyChange,
}) {
  const { getClickableText, tooltipElement } = useArticleContent();
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  console.log("==== ArticleContent ====", article);

  if (!article) return null;
  const { imagesData = [] } = article;
  const filteredImageData = filterImageUrls(imagesData);
  const imageUrl = filteredImageData.length ? filteredImageData[0].url : null;
  const imageAlt = filteredImageData.length ? filteredImageData[0].alt : article.title;
  const refUrl = filteredImageData.length ? filteredImageData[0].refUrl : null;

  const getDifficultyLabel = () => {
    const label = selectedDifficulty
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return label.length > 12 ? `${label.slice(0, 12)}...` : label;
  };

  const getButtonTheme = () => {
    return difficultyThemes[selectedDifficulty] || difficultyThemes.default;
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-wrap items-start gap-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 flex-1">
            {article.title}
          </h1>
          <button
            onClick={() => setShowDifficultyModal(true)}
            className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors ${getButtonTheme()}`}
            title={selectedDifficulty.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span className="font-medium max-w-[100px] truncate">{getDifficultyLabel()}</span>
            <span className="text-[10px] opacity-75 border-l border-current pl-2 ml-1">Change</span>
          </button>
        </div>

        {/* Summary Section */}
        <div className="text-xl text-gray-600 font-medium italic mb-8 border-l-4 border-indigo-500 pl-6">
          {article.summary}
        </div>

        {/* Content with Floating Image */}
        <div className="relative">
          {/* Floating Image Container */}
          <div className="float-right ml-8 mb-6 w-2/5">
            <div className="sticky top-8">
              <div className="rounded-lg overflow-hidden shadow-lg mb-2">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="h-[250px]">
                    <PlaceholderImage />
                  </div>
                )}
              </div>
              {imageUrl && imageUrl.length > 0 && (
                <div className="text-center">
                  <a
                    href={refUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Source: Wikipedia</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {contentLoading ? (
            <div className="space-y-6 w-[57%]">
              <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-5/6"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-4/5"></div>
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed space-y-6">
                {content.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-lg">
                    {getClickableText(paragraph)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Clear float */}
          <div className="clear-both"></div>
        </div>
      </div>

      {tooltipElement}

      {showDifficultyModal && (
        <DifficultyLevelModal
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={onDifficultyChange}
          onClose={() => setShowDifficultyModal(false)}
        />
      )}
    </article>
  );
}
