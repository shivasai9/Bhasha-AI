import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useArticleView } from '../../hooks/useArticleView';
import ArticleContent from './ArticleContent';
import WordInteractionModal from './WordInteractionModal';
import SummaryWriter from './SummaryWriter';
import AudioPlayer from './AudioPlayer';
import QuizSection from './QuizSection';

export default function ArticleView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty');
  
  const {
    article,
    selectedWord,
    isWordModalOpen,
    loading,
    handleWordClick,
    closeWordModal,
    handleSaveWord,
  } = useArticleView(id, difficulty);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <ArticleContent
          article={article}
          onWordClick={handleWordClick}
        />
        
        <AudioPlayer text={article?.content} />
        
        <SummaryWriter />
        
        <QuizSection article={article} />

        {isWordModalOpen && (
          <WordInteractionModal
            word={selectedWord}
            onClose={closeWordModal}
            onSave={handleSaveWord}
          />
        )}
      </div>
    </div>
  );
}