import React, { useState } from "react";
import { useLabels } from "../hooks/useLabels";
import DifficultyModal from "./DifficultyModal";
import { BookOpen } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";
import ImageAttribution from "./ArticleView/ImageAttribution";
import { convertToKebabCase, filterImageUrls } from "../lib/utils";

const presetDifficulties = [
  {
    id: "easy",
    label: "Easy",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  },
  {
    id: "medium",
    label: "Medium",
    className: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
  {
    id: "hard",
    label: "Hard",
    className: "bg-rose-100 text-rose-700 hover:bg-rose-200",
  },
];

export default function ArticleCard({ article, onDifficultySelect, disabled }) {
  const labels = useLabels('ARTICLE_CARD_LABELS');
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const kebabCaseTitle = convertToKebabCase(article.title);

  const handlePresetDifficulty = (difficulty) => {
    onDifficultySelect(article.articleID, kebabCaseTitle, difficulty);
  };

  const handleDifficultyClick = (e, difficulty) => {
    e.preventDefault();
    if (e.metaKey || e.ctrlKey) {
      // Open in new tab
      window.open(
        `/article/${article.articleID}/${kebabCaseTitle}/${difficulty.id}`,
        "_blank"
      );
    } else {
      handlePresetDifficulty(difficulty);
    }
  };

  const { imagesData = [] } = article;
  const filteredImageData = filterImageUrls(imagesData);
  const imageData = filteredImageData.length ? filteredImageData[0] : null;
  const imageUrl = imageData?.url;
  const imageAlt = imageData?.alt || article.title;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden flex h-[240px] ${
        disabled ? "opacity-70" : ""
      }`}
    >
      <div className="w-1/3 relative">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0">
              <ImageAttribution 
                attribution={{
                  artist: imageData.attribution?.artist,
                  license: {
                    name: imageData.attribution?.licenseName,
                    url: imageData.attribution?.licenseUrl
                  },
                  source: imageData.attribution?.imagePage
                }} 
              />
            </div>
          </>
        ) : (
          <PlaceholderImage />
        )}
      </div>
      <div className="w-2/3 p-6 flex flex-col">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
          {article.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3 min-h-[4.5rem]">
          {article.summary}
        </p>

        <div className="flex items-center gap-3 mt-auto">
          {presetDifficulties.map((difficulty) => (
            <a
              key={difficulty.id}
              href={`/article/${article.articleID}/${kebabCaseTitle}/${difficulty.id}`}
              onClick={(e) => handleDifficultyClick(e, difficulty)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                difficulty.className
              } ${disabled ? "cursor-not-allowed" : ""}`}
            >
              {labels[`${difficulty.id}Label`]}
            </a>
          ))}

          <span className="text-sm text-gray-500">{labels.orText}</span>

          <button
            onClick={() => setShowDifficultyModal(true)}
            disabled={disabled}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors flex items-center font-medium ${
              disabled ? "cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {labels.customLevelButton}
          </button>
        </div>
      </div>

      {showDifficultyModal && (
        <DifficultyModal
          onClose={() => setShowDifficultyModal(false)}
          onSubmit={(difficulty) =>
            onDifficultySelect(article.articleID, kebabCaseTitle, difficulty)
          }
        />
      )}
    </div>
  );
}
