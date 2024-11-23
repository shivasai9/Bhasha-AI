
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleText({ content, getClickableText }) {
  return (
    <div className="prose prose-lg max-w-none">
      <div className="text-gray-800 leading-relaxed space-y-6">
        {content.split("\n").map((paragraph, index) => (
          <p key={index} className="text-lg">
            {getClickableText(paragraph)}
          </p>
        ))}
      </div>
    </div>
  );
}