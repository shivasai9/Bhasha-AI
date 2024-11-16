import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { CheckCircle, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import QuizSkeleton from './QuizSkeleton';

export default function QuizSection({ article, content }) {
  const {
    questions,
    currentQuestion,
    answeredQuestions,
    selectedAnswer,
    showResult,
    score,
    currentQuestionIndex,
    totalQuestions,
    handleAnswerSelect,
    handleNextQuestion,
    restartQuiz,
    loading,
  } = useQuiz(article, content);

  if (loading) return <QuizSkeleton />;
  if (!questions.length) return null;

  if (showResult) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-12 text-center text-white">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-lg opacity-90">Here's how well you understood the article</p>
        </div>
        
        <div className="p-8 text-center">
          <div className="mb-8">
            <p className="text-5xl font-bold text-indigo-600 mb-2">{score}%</p>
            <p className="text-gray-600">
              You got {Math.round((score / 100) * totalQuestions)} out of {totalQuestions} questions right
            </p>
          </div>

          <button
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((answeredQuestions) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="p-8">
        {/* Question Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </h3>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            {Math.round(((answeredQuestions) / totalQuestions) * 100)}% Complete
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = isSelected && currentQuestion.isCorrect(option);
            const isWrong = isSelected && !currentQuestion.isCorrect(option);

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : selectedAnswer
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                } flex items-center justify-between`}
              >
                <span className={`font-medium ${
                  isCorrect ? 'text-green-700' : 
                  isWrong ? 'text-red-700' : 
                  'text-gray-700'
                }`}>
                  {option}
                </span>
                {isSelected && (
                  isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {selectedAnswer && (
          <div className={`p-4 rounded-lg mb-6 ${
            currentQuestion.isCorrect(selectedAnswer)
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              currentQuestion.isCorrect(selectedAnswer)
                ? 'text-green-800'
                : 'text-red-800'
            }`}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {selectedAnswer && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Show Results
                <Award className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}