import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, ArrowLeft, Search } from "lucide-react";
import Header from "./common/Header";
import { useArticles } from "../hooks/useArticles";
import ArticleCard from "./ArticleCard";
import CustomTopicForm from "./CustomTopicForm";
import SkeletonArticleCard from "./SkeletonArticleCard";

export default function ArticleList() {
  const {
    articles,
    loading,
    generateCustomArticle,
    generatingCount,
    generateMoreArticles,
    isCustomArticle,
    labels,
  } = useArticles();
  const navigate = useNavigate();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const handleDifficultySelect = (articleId, title, difficulty) => {
    // Prevent interaction while loading
    // TODO: Make it better
    if (loading || generatingCount > 0) return;
    navigate(`/article/${articleId}/${title}/${difficulty.id}`);
  };

  const handleCustomTopic = async (topic) => {
    try {
      await generateCustomArticle(topic);
    } catch (error) {
      console.error("Error generating custom article:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={labels.goBack}
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {labels.pageTitle}
            </h1>
          </div>

          {/* Create Custom Article Button */}
          {!showCustomForm && (
            <>
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full mb-3 py-4 bg-white hover:bg-gray-50 text-indigo-600 
                font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {labels.customArticleButton}
              </button>

              <button
                onClick={() => handleCustomTopic("Any Random Topic")}
                className="w-full mb-6 py-4 bg-white hover:bg-gray-50 text-emerald-600 
                font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {labels.randomArticleButton}
              </button>
            </>
          )}

          {/* Custom Article Form */}
          {showCustomForm && (
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Create a Custom Article</h2>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <CustomTopicForm onSubmit={handleCustomTopic} />
            </div>
          )}

          <div className="space-y-6">
            {/* Custom article skeleton at top */}
            {isCustomArticle && generatingCount > 0 && <SkeletonArticleCard />}
            {/* Custom article loading message */}
            {isCustomArticle && generatingCount > 0 && (
              <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                <p className="text-gray-600">{labels.generatingArticle}</p>
              </div>
            )}
            {/* Existing articles */}
            <div className={`space-y-6`}>
              {articles.map((article) => (
                <ArticleCard
                  key={article.articleID}
                  article={article}
                  onDifficultySelect={handleDifficultySelect}
                  disabled={false}
                  // Lets enable all the click actions on the cards while other articles are loading
                />
              ))}
            </div>
            {/* Load more skeletons - show only when loading more articles */}
            {!isCustomArticle && generatingCount > 0 && (
              <div className="space-y-6">
                {[...Array(generatingCount)].map((_, i) => (
                  <SkeletonArticleCard key={`load-more-${i}`} />
                ))}
              </div>
            )}
            {/* Custom article loading message */}
            {!isCustomArticle && generatingCount > 0 && (
              <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                <p className="text-gray-600">
                  {labels.generatingArticles.replace(
                    "{count}",
                    generatingCount.toString()
                  )}
                </p>
              </div>
            )}

            {/* Add Load More button */}
            {!loading && generatingCount === 0 && articles.length > 0 && (
              <button
                onClick={generateMoreArticles}
                className="w-full py-4 bg-white hover:bg-gray-50 text-indigo-600 font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {labels.loadMoreButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
