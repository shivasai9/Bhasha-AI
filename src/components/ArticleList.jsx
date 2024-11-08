import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from './ArticleCard';
import CustomTopicForm from './CustomTopicForm';

export default function ArticleList() {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const { articles, loading, generateCustomArticle } = useArticles();
  const navigate = useNavigate();

  const handleDifficultySelect = (articleId, difficulty) => {
    navigate(`/article/${articleId}?difficulty=${difficulty.id}`);
  };

  const handleCustomTopic = async (topic) => {
    const newArticle = await generateCustomArticle(topic);
    if (newArticle) {
      setShowCustomForm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Generating interesting articles...</p>
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
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Custom Topic
            </button>
          </div>

          {showCustomForm && (
            <CustomTopicForm onSubmit={handleCustomTopic} />
          )}

          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDifficultySelect={handleDifficultySelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}