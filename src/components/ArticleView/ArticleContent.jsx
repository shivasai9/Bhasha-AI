import React from 'react';
import { useArticleContent } from '../../hooks/useArticleContent';
import { ExternalLink } from 'lucide-react';

export default function ArticleContent({ article, onWordClick }) {
  const { getClickableText, tooltipElement } = useArticleContent();

  if (!article) return null;

  const getThumbnailUrl = (keywords) => {
    return "https://www.levelify.me/_next/image?url=https%3A%2F%2Fik.imagekit.io%2Fko3vczxvh%2Ftr%3Aw-auto%2Cfo-auto%2FheroImage.png&w=1920&q=75";
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-8 max-w-4xl mx-auto">
        {/* Title Section */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
        
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
                <img
                  src={getThumbnailUrl(article.imageKeywords)}
                  alt=""
                  className="w-full h-auto"
                />
              </div>
              <div className="text-center">
                <a 
                  href="https://en.wikipedia.org/wiki/Coffee_preparation" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Source: Wikipedia</span>
                </a>
              </div>
            </div>
          </div>

          {/* Article Text */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-6">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {getClickableText(paragraph)}
                </p>
              ))}
            </div>
          </div>

          {/* Clear float */}
          <div className="clear-both"></div>
        </div>
      </div>

      {tooltipElement}
    </article>
  );
}