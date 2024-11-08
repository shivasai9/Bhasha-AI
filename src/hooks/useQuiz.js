import { useState, useEffect } from 'react';

export function useQuiz(article) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    if (article) {
      // In a real implementation, this would use Chrome's AI API to generate questions
      setQuestions([
        {
          question: 'Sample question 1?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          isCorrect: (answer) => answer === 'Option A',
          explanation: 'Explanation for the correct answer'
        },
        // Add more sample questions
      ]);
    }
  }, [article]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (questions[currentQuestionIndex].isCorrect(answer)) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setScore(Math.round((correctAnswers / questions.length) * 100));
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCorrectAnswers(0);
  };

  return {
    questions,
    currentQuestion: questions[currentQuestionIndex],
    selectedAnswer,
    showResult,
    score,
    handleAnswerSelect,
    handleNextQuestion,
    restartQuiz
  };
}