import React from "react";
import {
  BookOpen,
  FileText,
  BrainCircuit,
  ArrowLeft,
  Gauge,
} from "lucide-react";
import { useArticleView } from "../../hooks/useArticleView";
import ArticleContent from "./ArticleContent";
import WordInteractionModal from "./WordInteractionModal";
import SummaryWriter from "./SummaryWriter";
import AudioPlayer from "./AudioPlayer";
import QuizSection from "./QuizSection";

const tabs = [
  {
    id: "read",
    label: "Read",
    icon: BookOpen,
    description:
      "Read the article and click on words to see their meanings, translations, and more.",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: FileText,
    description:
      "Write a summary of the article and get AI-powered feedback to improve your writing.",
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: BrainCircuit,
    description:
      "Test your understanding of the article with interactive questions.",
  },
];

export default function ArticleView() {
  const {
    article,
    articleContent,
    contentLoading,
    selectedWord,
    isWordModalOpen,
    activeTab,
    articleDataLoading,
    setActiveTab,
    handleWordClick,
    closeWordModal,
    handleSaveWord,
    navigate,
    selectedDifficulty,
    handleDifficultyChange,
  } = useArticleView();

  const renderContent = () => {
    switch (activeTab) {
      case "read":
        if (articleDataLoading) {
          return (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse text-gray-600">
                Generating article content...
              </div>
            </div>
          );
        }
        return (
          <>
            <ArticleContent
              article={article}
              content={articleContent}
              onWordClick={handleWordClick}
              contentLoading={contentLoading}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={handleDifficultyChange}
            />
            <AudioPlayer text={articleContent} />
          </>
        );
      case "summarize":
        return <SummaryWriter />;
      case "quiz":
        return <QuizSection article={article} />;
      default:
        return null;
    }
  };

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate("/articles")}
          className="flex items-center gap-2 mb-4 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

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
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
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
