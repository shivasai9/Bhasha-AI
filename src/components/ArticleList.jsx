import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import Header from "./common/Header";
import {
  BookOpen,
  ChevronDown,
  Check,
  Globe2,
} from "lucide-react";
import { useArticles } from "../hooks/useArticles";
import useLanguageSelector from "../hooks/uselanguageSelector";
import ArticleCard from "./ArticleCard";
import CustomTopicForm from "./CustomTopicForm";
import SkeletonArticleCard from "./SkeletonArticleCard";
import { LANGUAGES } from "../lib/constants";

export default function ArticleList() {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const {
    articles,
    loading,
    generateCustomArticle,
    generatingCount,
    generateMoreArticles,
    isCustomArticle,
  } = useArticles();
  const navigate = useNavigate();
  const handleDifficultySelect = (articleId, title, difficulty) => {
    // Prevent interaction while loading
    // TODO: Make it better
    if (loading || generatingCount > 0) return;
    navigate(`/article/${articleId}/${title}/${difficulty.id}`);
  };

  const handleCustomTopic = async (topic) => {
    try {
      await generateCustomArticle(topic);
      setShowCustomForm(false);
    } catch (error) {
      console.error("Error generating custom article:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Available Articles
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCustomForm(!showCustomForm)}
                disabled={loading || generatingCount > 0}
                className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
                  loading || generatingCount > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Custom Article
              </button>
            </div>
          </div>

          {showCustomForm && <CustomTopicForm onSubmit={handleCustomTopic} />}

          <div className="space-y-6">
            {/* Custom article skeleton at top */}
            {isCustomArticle && generatingCount > 0 && <SkeletonArticleCard />}
            {/* Custom article loading message */}
            {isCustomArticle && generatingCount > 0 && (
              <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
                <p className="text-gray-600">Generating custom article...</p>
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
                  Generating article(s)... ({generatingCount} remaining)
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
                Load More Articles
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}