import { useState, useEffect } from "react";
import { aiWrapper } from "../lib/ai";
import {
  getArticleById,
  getArticleContent,
  getQuizQuestions,
  saveQuizQuestions,
} from "../lib/dbUtils";
import { translateQuestions } from "../lib/translation.service";

export function useQuiz(article, selectedDifficulty) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const loadQuizQuestions = async () => {
    if (article) {
      try {
        let articleQuizData = await getQuizQuestions(
          article.articleID,
          selectedDifficulty,
          article.language
        );
        if (articleQuizData) {
          setQuestions(
            articleQuizData.questions.map((field) => {
              return {
                question: field.question,
                options: field.options,
                answer: field.answer,
                isCorrect: (answer) => answer === field.answer,
                explanation: field.explanation,
              };
            })
          );
          return;
        } else {
          // Checking for English Quiz data is available or not
          if (article.language !== "english") {
            let articleEngQuizData = await getQuizQuestions(
              article.originalArticleId,
              selectedDifficulty,
              "english"
            );
            if (articleEngQuizData) {
              const translatedQuestions = await translateQuestions(
                articleEngQuizData.questions,
                "english",
                article.language
              );
              const contentToSave = {
                articleID: article.articleID,
                questions: translatedQuestions,
                level: selectedDifficulty,
                language: article.language,
                timestamp: Date.now(),
              };
              await saveQuizQuestions(contentToSave);
              setQuestions(
                translatedQuestions.map((field) => {
                  return {
                    question: field.question,
                    options: field.options,
                    answer: field.answer,
                    isCorrect: (answer) => answer === field.answer,
                    explanation: field.explanation,
                  };
                })
              );
              return;
            }
          }

          // fetching questions based on the article content
          try {
            console.log(article);
            const engContent = await getArticleContent(
              article.language !== "english"
                ? article.originalArticleId
                : article.articleID,
              selectedDifficulty,
              "english"
            );
            console.log("Eng content", engContent);
            let engTitle = article.title;
            if (article.language !== "english") {
              const englishArticleData = await getArticleById(
                article.originalArticleId
              );
              engTitle = englishArticleData.title;
            }
            let generatedQuizQuestions = await aiWrapper.generateQuiz(
              engTitle,
              engContent.content
            );

            const contentToSave = {
              articleID:
                article.language !== "english"
                  ? article.originalArticleId
                  : article.articleID,
              questions: generatedQuizQuestions,
              level: selectedDifficulty,
              language: "english",
              timestamp: Date.now(),
            };
            await saveQuizQuestions(contentToSave);
            if (article.language !== "english") {
              generatedQuizQuestions = await translateQuestions(
                generatedQuizQuestions,
                "english",
                article.language
              );
              const contentToSave = {
                articleID: article.articleID,
                questions: generatedQuizQuestions,
                level: selectedDifficulty,
                language: article.language,
                timestamp: Date.now(),
              };
              await saveQuizQuestions(contentToSave);
            }
            setQuestions(
              generatedQuizQuestions.map((field) => {
                return {
                  question: field.question,
                  options: field.options,
                  answer: field.answer,
                  isCorrect: (answer) => answer === field.answer,
                  explanation: field.explanation,
                };
              })
            );
          } catch (error) {
            console.error("Error generating custom article:", error);
            return null;
          }
        }
      } catch (error) {
        console.error("Error loading article or quiz:", error);
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
      setCorrectAnswers((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => prev + 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
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
