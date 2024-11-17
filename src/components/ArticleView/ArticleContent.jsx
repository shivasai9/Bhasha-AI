import React from "react";
import { useArticleContent } from "../../hooks/useArticleContent";
import { ExternalLink } from "lucide-react";
import PlaceholderImage from "../PlaceholderImage";
import DifficultyLevelModal from './DifficultyLevelModal.jsx';
import DraggableToolbar from './DraggableToolbar';
import ReactMarkdown from 'react-markdown';

const difficultyThemes = {
  easy: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  medium: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  hard: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
  default: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
};

export default function ArticleContent({
  article,
  content,
  contentLoading,
  selectedDifficulty,
  onDifficultyChange,
}) {
  const {
    getClickableText,
    tooltipElement,
    showDifficultyModal,
    setShowDifficultyModal,
    showSummary,
    summary,
    summaryLoading,
    handleSummaryClick,
    articleData
  } = useArticleContent(article, content, selectedDifficulty);

  const processChildren = (children) => {
    return React.Children.map(children, child => {
      if (typeof child === 'string') {
        return getClickableText(child);
      }
      return child;
    });
  };

  if (!article) return null;
  const { imageUrl, imageAlt, refUrl } = articleData;

  const getDifficultyLabel = () => {
    return selectedDifficulty
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getButtonTheme = () => {
    return difficultyThemes[selectedDifficulty] || difficultyThemes.default;
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <DraggableToolbar
        onSummaryClick={handleSummaryClick}
        onDifficultyClick={() => setShowDifficultyModal(true)}
        showSummary={showSummary}
        difficultyLabel={getDifficultyLabel()}
        buttonTheme={getButtonTheme()}
      />

      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        <div className="relative">
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

          {contentLoading || summaryLoading ? (
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
          ) : showSummary ? (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed space-y-6">
                {summary ? (
                  <ReactMarkdown
                    components={{
                      p: ({children}) => <p className="text-lg">{processChildren(children)}</p>,
                      h1: ({children}) => <h1 className="text-3xl font-bold mb-4">{processChildren(children)}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-bold mb-3">{processChildren(children)}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-bold mb-2">{processChildren(children)}</h3>,
                      ul: ({children}) => <ul className="list-disc pl-6 space-y-2">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-6 space-y-2">{children}</ol>,
                      li: ({children}) => <li className="text-lg">{processChildren(children)}</li>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-gray-200 pl-4 italic">
                          {processChildren(children)}
                        </blockquote>
                      ),
                      strong: ({children}) => <strong className="font-bold">{processChildren(children)}</strong>,
                      em: ({children}) => <em className="italic">{processChildren(children)}</em>
                    }}
                  >
                    {summary}
                  </ReactMarkdown>
                ) : (
                  <p className="text-lg">No summary available</p>
                )}
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
