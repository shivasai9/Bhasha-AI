import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe2,
  BookOpen,
  Sparkles,
  BookOpenCheck,
  Layout,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import useLanguageSelector from "../hooks/uselanguageSelector";
import { LANGUAGES, TOPICS } from "../lib/constants";
import { getTopics } from "../lib/languageStorage";
import { useLabels } from "../hooks/useLabels";
import { useApiStatus } from "../hooks/useApiStatus";
import { AlertTriangle, AlertCircle } from "lucide-react";
import ApiStatusBanner from "./ApiStatusBanner";

export default function LanguageSelector() {
  const navigate = useNavigate();
  const {
    handleWebsiteLanguage,
    handleTargetLanguage,
    handleTopicsSelect,
    step,
    handleBack,
    handleStepClick,
    direction,
    selectedWebsiteLang,
    selectedLearningLang,
  } = useLanguageSelector();

  const [selectedTopics, setSelectedTopics] = useState([]);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const labels = useLabels("LANGUAGE_SELECTOR_LABELS");
  const topicLabels = useLabels("TOPIC_LABELS");
  const { translationStatus, promptsStatus, summarizationStatus } =
    useApiStatus();

  const isApisAvailable =
    translationStatus === "Available" ||
    promptsStatus === "Available" ||
    summarizationStatus === "Available";

  useEffect(() => {
    if (progressRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [step]);

  useEffect(() => {
    const savedTopics = getTopics();
    setSelectedTopics(savedTopics);
  }, []);

  const getAnimation = () => {
    if (step === 1 && direction === "forward") {
      return "animate-fadeUp";
    }
    return direction === "back"
      ? "animate-slideInLeft"
      : "animate-slideInRight";
  };

  const toggleTopic = (topicId) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    );
  };

  const handleNavigateToArticles = (topics = []) => {
    handleTopicsSelect(topics);
    navigate("/learning-mode-selector");
  };

  const ProgressBar = () => (
    <div className="mb-8 sticky top-0 bg-white pt-4 z-10" ref={progressRef}>
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <button
              onClick={() => i < step && handleStepClick(i)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                i < step
                  ? "bg-green-500 cursor-pointer hover:bg-green-600"
                  : i === step
                  ? "bg-indigo-600"
                  : "bg-gray-200"
              }`}
              disabled={i >= step}
              title={i < step ? "Go back to this step" : ""}
            >
              {step > i ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white">{i}</span>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
      </div>
    </div>
  );

  const BackButton = () =>
    step > 1 ? (
      <button
        onClick={handleBack}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 transition-colors group"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
        <span className="sr-only">Go back</span>
      </button>
    ) : null;

  const renderStep = () => {
    const animation = getAnimation();

    switch (step) {
      case 1:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <Layout className="w-6 h-6 animate-pulse text-indigo-600" />
                <p className="text-xl font-medium">
                  {labels?.steps?.interface?.title}
                </p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                {labels?.steps?.interface?.description}
              </p>
            </div>
            <div
              className={`grid gap-6 md:grid-cols-3 ${
                !isApisAvailable ? "opacity-60" : ""
              }`}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    isApisAvailable && handleWebsiteLanguage(lang.name)
                  }
                  disabled={!isApisAvailable}
                  className={`group relative overflow-hidden p-6 bg-white rounded-xl border-2 
                    ${
                      selectedWebsiteLang.toLowerCase() ===
                      lang.name.toLowerCase()
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-indigo-100 hover:border-indigo-400"
                    } 
                    transition-all duration-300 hover:shadow-xl transform 
                    ${
                      isApisAvailable
                        ? "hover:-translate-y-1"
                        : "cursor-not-allowed"
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform">
                      {lang.flag}
                    </span>
                    <span className="text-lg font-medium text-gray-700">
                      {lang.name}
                    </span>
                  </div>
                  {selectedWebsiteLang.toLowerCase() ===
                    lang.name.toLowerCase() && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {!isApisAvailable && (
              <div className="mt-4 text-center text-sm text-red-600">
                Please enable required features to start selecting languages
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <BookOpenCheck className="w-6 h-6 animate-pulse text-indigo-600" />
                <p className="text-xl font-medium">
                  {labels?.steps?.learning?.title}
                </p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                {labels?.steps?.learning?.description}
              </p>
            </div>
            <div
              className={`grid gap-6 md:grid-cols-3 ${
                !isApisAvailable ? "opacity-60" : ""
              }`}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    isApisAvailable && handleTargetLanguage(lang.name)
                  }
                  disabled={!isApisAvailable}
                  className={`group relative overflow-hidden p-6 bg-white rounded-xl border-2 
                    ${
                      selectedLearningLang.toLowerCase() ===
                      lang.name.toLowerCase()
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-indigo-100 hover:border-indigo-400"
                    } 
                    transition-all duration-300 hover:shadow-xl transform 
                    ${
                      isApisAvailable
                        ? "hover:-translate-y-1"
                        : "cursor-not-allowed"
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform">
                      {lang.flag}
                    </span>
                    <span className="text-lg font-medium text-gray-700">
                      {lang.name}
                    </span>
                  </div>
                  {selectedLearningLang.toLowerCase() ===
                    lang.name.toLowerCase() && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {!isApisAvailable && (
              <div className="mt-4 text-center text-sm text-red-600">
                Please enable required features to start selecting languages
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <p className="text-xl font-medium">
                    {labels?.steps?.topics?.title}
                  </p>
                </div>
                {/* <button
                  onClick={() => handleNavigateToArticles([])}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {labels?.steps?.topics?.skipButton}{" "}
                  <ArrowRight className="w-4 h-4" />
                </button> */}
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                {labels?.steps?.topics?.description}
              </p>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {(topicLabels?.TOPICS || TOPICS).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`p-3 rounded-lg border text-left hover:shadow-sm transition-all h-full ${
                    selectedTopics.includes(topic.id)
                      ? "bg-indigo-50 border-indigo-400"
                      : "bg-white border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2 items-start flex-1">
                      <span
                        className="text-xl mt-0.5"
                        role="img"
                        aria-label={topic.name}
                      >
                        {topic.icon}
                      </span>
                      <div className="space-y-1 flex-1">
                        <h3 className="text-sm font-medium text-gray-800">
                          {topic.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 transition-all mt-1 ${
                        selectedTopics.includes(topic.id)
                          ? "text-indigo-600"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNavigateToArticles(selectedTopics)}
              disabled={selectedTopics.length === 0}
              className={`mt-6 w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                selectedTopics.length > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {labels?.continueButton?.replace(
                "{count}",
                selectedTopics.length
              )}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div
            ref={containerRef}
            className="p-8 max-h-[90vh] overflow-y-auto relative scroll-smooth"
          >
            <BackButton />
            <div className="flex items-center justify-center mb-8">
              <Globe2 className="w-12 h-12 text-indigo-600 mr-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                {"BhashaAI"}
              </h1>
            </div>
            <ApiStatusBanner isApisAvailable={isApisAvailable} />
            <ProgressBar />
            <div className="space-y-6">
              <div className="relative overflow-hidden">{renderStep()}</div>
              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <p>{labels?.poweredBy}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
