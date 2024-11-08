import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, FileText, BrainCircuit } from 'lucide-react';
import { useArticleView } from '../../hooks/useArticleView';
import ArticleContent from './ArticleContent';
import WordInteractionModal from './WordInteractionModal';
import SummaryWriter from './SummaryWriter';
import AudioPlayer from './AudioPlayer';
import QuizSection from './QuizSection';

const tabs = [
  { 
    id: 'read', 
    label: 'Read', 
    icon: BookOpen,
    description: 'Read the article and click on words to see their meanings, translations, and more.'
  },
  { 
    id: 'summarize', 
    label: 'Summarize', 
    icon: FileText,
    description: 'Write a summary of the article and get AI-powered feedback to improve your writing.'
  },
  { 
    id: 'quiz', 
    label: 'Quiz', 
    icon: BrainCircuit,
    description: 'Test your understanding of the article with interactive questions.'
  }
];

export default function ArticleView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty');
  const [activeTab, setActiveTab] = useState('read');
  
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

  const renderContent = () => {
    switch (activeTab) {
      case 'read':
        return (
          <>
            <ArticleContent
              article={article}
              onWordClick={handleWordClick}
            />
            <AudioPlayer text={article?.content} />
          </>
        );
      case 'summarize':
        return <SummaryWriter />;
      case 'quiz':
        return <QuizSection article={article} />;
      default:
        return null;
    }
  };

  const activeTabInfo = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Tab Description */}
          <div className="p-4 bg-gray-50 border-b text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <activeTabInfo.icon className="w-4 h-4 text-indigo-600" />
              <p>{activeTabInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}

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