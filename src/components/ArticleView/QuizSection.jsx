import React from 'react';
import { useQuiz } from '../../hooks/useQuiz';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuizSection({ article }) {
  const {
    questions,
    currentQuestion,
    selectedAnswer,
    showResult,
    score,
    handleAnswerSelect,
    handleNextQuestion,
    restartQuiz
  } = useQuiz(article);

  if (!questions.length) return null;

  if (showResult) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Results</h2>
        <div className="text-center">
          <p className="text-4xl font-bold text-indigo-600 mb-2">{score}%</p>
          <p className="text-gray-600 mb-6">Great effort! Keep learning!</p>
          <button
            onClick={restartQuiz}
            className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Your Understanding</h2>
      
      <div className="mb-6">
        <p className="text-lg text-gray-800 mb-4">{currentQuestion.question}</p>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg transition-colors ${
                selectedAnswer === option
                  ? 'bg-indigo-100 border-indigo-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              } border`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {selectedAnswer && (
        <div className={`p-4 rounded-lg mb-4 ${
          currentQuestion.isCorrect(selectedAnswer)
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {currentQuestion.isCorrect(selectedAnswer) ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <p>{currentQuestion.explanation}</p>
          </div>
        </div>
      )}

      {selectedAnswer && (
        <button
          onClick={handleNextQuestion}
          className="w-full bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Next Question
        </button>
      )}
    </div>
  );
}