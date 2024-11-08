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
      // Sample questions based on the article content
      setQuestions([
        {
          question: "What role do coffee beans' origin and roast play in coffee making?",
          options: [
            "They only affect the color",
            "They are crucial for the final taste",
            "They only matter for espresso",
            "They have no impact on flavor"
          ],
          isCorrect: (answer) => answer === "They are crucial for the final taste",
          explanation: "The origin and roast of coffee beans play a crucial role in determining the final taste of the coffee, affecting its flavor profile and characteristics."
        },
        {
          question: "Which of these is NOT mentioned as a coffee brewing technique?",
          options: [
            "Pour-over",
            "Cold brew",
            "French press",
            "Espresso"
          ],
          isCorrect: (answer) => answer === "Cold brew",
          explanation: "While pour-over, espresso, and French press are mentioned as brewing techniques, cold brew is not discussed in the article."
        },
        {
          question: "What is the main skill a barista needs to develop?",
          options: [
            "Speed of service",
            "Customer relations",
            "Balancing brewing variables",
            "Coffee bean selection"
          ],
          isCorrect: (answer) => answer === "Balancing brewing variables",
          explanation: "According to the article, a barista learns to balance various brewing variables to bring out the unique qualities of each bean."
        }
      ]);
    }
  }, [article]);

  const handleAnswerSelect = (answer) => {
    if (selectedAnswer) return; // Prevent changing answer once selected
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
    currentQuestionIndex,
    totalQuestions: questions.length,
    handleAnswerSelect,
    handleNextQuestion,
    restartQuiz
  };
}