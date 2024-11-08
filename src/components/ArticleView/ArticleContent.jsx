import React from 'react';
import { useArticleContent } from '../../hooks/useArticleContent';

export default function ArticleContent({ article, onWordClick }) {
  const { getClickableText, tooltipElement } = useArticleContent();

  if (!article) return null;

  return (
    <article className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 text-lg mb-8 font-medium italic border-l-4 border-indigo-500 pl-4">
          {article.summary}
        </p>
        
        <div className="text-gray-800 leading-relaxed space-y-4">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index}>
              {getClickableText(paragraph)}
            </p>
          ))}
        </div>
      </div>

      {tooltipElement}
    </article>
  );
}