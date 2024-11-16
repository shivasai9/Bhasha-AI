import { useState, useEffect } from 'react';
import { aiWrapper } from '../lib/ai';

export function useQuiz(article, content) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const loadQuizQuestions = async ()=>{
    if (article) {
      // fetching questions based on the article content
      try {
        const quizQuestions = await aiWrapper.generateQuiz(article.title, content);
        setQuestions(quizQuestions.map(field=>{
          return({
            question: field.question,
            options: field.options,
            isCorrect: (answer) => answer === field.answer,
            explanation: field.explanation
          });
        }));
        
      } catch (error) {
        console.error('Error generating custom article:', error);
        return null;
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadQuizQuestions();
  }, [article]);

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent changing answer once selected
    setSelectedAnswer(answer);
    if (questions[currentQuestionIndex].isCorrect(answer)) {
      setCorrectAnswers(prev => prev + 1);
    }
    setAnsweredQuestions(prev => prev + 1);
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
    setAnsweredQuestions(0);
  };

  return {
    questions,
    currentQuestion: questions[currentQuestionIndex],
    answeredQuestions,
    selectedAnswer,
    showResult,
    score,
    currentQuestionIndex,
    totalQuestions: questions.length,
    handleAnswerSelect,
    handleNextQuestion,
    restartQuiz,
    loading,
  };
}