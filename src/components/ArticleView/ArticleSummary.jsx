
import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleSummary({ summary, processChildren, labels }) {
  return (
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
          <p className="text-lg">{labels.articleInfo.noSummary}</p>
        )}
      </div>
    </div>
  );
}