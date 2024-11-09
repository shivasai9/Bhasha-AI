import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from './ArticleCard';
import CustomTopicForm from './CustomTopicForm';

export default function ArticleList() {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const { articles, loading, initialLoading, generateCustomArticle, generatingCount, generateMoreArticles } = useArticles();
  const navigate = useNavigate();

  const handleDifficultySelect = (articleId, difficulty) => {
    // Prevent interaction while loading
    if (loading || generatingCount > 0) return;
    navigate(`/article/${articleId}?difficulty=${difficulty.id}`);
  };

  const handleCustomTopic = async (topic) => {
    const newArticle = await generateCustomArticle(topic);
    if (newArticle) {
      setShowCustomForm(false);
    }
  };

  // Show full page loader when initially loading
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your reading list...</p>
        </div>
      </div>
    );
  }

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
              Available Articles
            </h1>
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              disabled={loading || generatingCount > 0}
              className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${
                loading || generatingCount > 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-indigo-700'
              }`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Custom Topic
            </button>
          </div>

          {showCustomForm && (
            <CustomTopicForm onSubmit={handleCustomTopic} />
          )}

          <div className="space-y-6">
            {articles.length === 0 && !generatingCount ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">No articles available. Try generating some!</p>
              </div>
            ) : (
              <>
                <div className={`space-y-6 ${loading || generatingCount > 0 ? 'pointer-events-none' : ''}`}>
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.articleID}
                      article={article}
                      onDifficultySelect={handleDifficultySelect}
                      disabled={false}
                    />
                  ))}
                </div>
                
                {generatingCount > 0 && (
                  <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
                    <p className="text-gray-600">
                      Generating next article... ({generatingCount} remaining)
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}