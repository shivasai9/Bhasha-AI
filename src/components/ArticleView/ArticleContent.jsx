import React from "react";
import { useArticleContent } from "../../hooks/useArticleContent";
import { ExternalLink } from "lucide-react";
import PlaceholderImage from "../PlaceholderImage";
import { filterImageUrls } from "../../lib/utils";

export default function ArticleContent({
  article,
  content,
  onWordClick,
  contentLoading,
}) {
  const { getClickableText, tooltipElement } = useArticleContent();
  console.log("==== ArticleContent ====", article);

  if (!article) return null;
  const { imagesData = [] } = article;
  const filteredImageData = filterImageUrls(imagesData);
  const imageUrl = filteredImageData.length ? filteredImageData[0].url : null;
  const imageAlt = filteredImageData.length ? filteredImageData[0].alt : article.title;
  const refUrl = filteredImageData.length ? filteredImageData[0].refUrl : null;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-8 max-w-4xl mx-auto">
        {/* Title Section */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {article.title}
        </h1>

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
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-gray-600">
                Generating article content...
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
    </article>
  );
}
