import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, BookOpen, Sparkles, BookOpenCheck, Layout, CheckCircle2, ChevronLeft, Plus, ArrowRight, X } from "lucide-react";
import useLanguageSelector from "../hooks/uselanguageSelector";
import { LANGUAGES, TOPICS } from "../lib/constants";

export default function LanguageSelector() {
  const navigate = useNavigate();
  const { handleWebsiteLanguage, handleTargetLanguage, handleTopicsSelect, step, handleBack, handleStepClick, direction } = useLanguageSelector();
  const [selectedTopics, setSelectedTopics] = useState([]);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTopics, setCustomTopics] = useState([]);

  useEffect(() => {
    if (progressRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [step]);

  const getAnimation = () => {
    if (step === 1 && direction === 'forward') {
      return 'animate-fadeUp';
    }
    return direction === 'back' ? 'animate-slideInLeft' : 'animate-slideInRight';
  };

  const toggleTopic = (topicName) => {
    setSelectedTopics(prev => 
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const handleAddCustomTopic = (e) => {
    e.preventDefault();
    if (customTopic.trim()) {
      const newTopic = {
        name: customTopic.trim(),
        description: 'Custom topic',
        isCustom: true
      };
      setCustomTopics(prev => [...prev, newTopic]);
      toggleTopic(newTopic.name);
      setCustomTopic('');
      setShowCustomInput(false);
    }
  };

  const handleNavigateToArticles = (topics = []) => {
    handleTopicsSelect(topics);
    navigate('/articles');
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
                  ? 'bg-green-500 cursor-pointer hover:bg-green-600' 
                  : i === step 
                    ? 'bg-indigo-600' 
                    : 'bg-gray-200'
              }`}
              disabled={i >= step}
              title={i < step ? 'Go back to this step' : ''}
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

  const BackButton = () => (
    step > 1 ? (
      <button
        onClick={handleBack}
        className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 transition-colors group"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
        <span className="sr-only">Go back</span>
      </button>
    ) : null
  );

  const CustomTopicsBadges = () => (
    customTopics.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {customTopics.map((topic) => (
          <div
            key={topic.name}
            className={`group inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
              selectedTopics.includes(topic.name)
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}
          >
            {topic.name}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleTopic(topic.name);
                setCustomTopics(prev => prev.filter(t => t.name !== topic.name));
              }}
              className="p-0.5 hover:bg-gray-200 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    )
  );

  const renderStep = () => {
    const animation = getAnimation();
    
    switch(step) {
      case 1:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <Layout className="w-6 h-6 animate-pulse text-indigo-600" />
                <p className="text-xl font-medium">Choose your language</p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                This will be used throughout the website for navigation and instructions. 
                You can change this later in settings.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleWebsiteLanguage(lang.name)}
                  className="group relative overflow-hidden p-6 bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <span className="text-lg font-medium text-gray-700">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center space-x-4 text-gray-600">
                <BookOpenCheck className="w-6 h-6 animate-pulse text-indigo-600" />
                <p className="text-xl font-medium">Which language would you like to learn?</p>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                Select the language you want to learn. We'll create personalized content 
                to help you master this language efficiently.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTargetLanguage(lang.name)}
                  className="group relative overflow-hidden p-6 bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-center">
                    <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform">{lang.flag}</span>
                    <span className="text-lg font-medium text-gray-700">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`${animation} relative`}>
            <div className="space-y-2 mb-8">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <p className="text-xl font-medium">What interests you?</p>
                </div>
                <button
                  onClick={() => handleNavigateToArticles([])}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Skip for now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500 ml-10 text-sm">
                Choose topics that interest you and we'll curate content aligned with your preferences. 
                Add custom topics or select from our suggestions.
              </p>
            </div>

            {/* Custom Topic Input */}
            {showCustomInput ? (
              <form onSubmit={handleAddCustomTopic} className="mb-4 px-0.5"> {/* Added px-0.5 for focus ring visibility */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="Enter your topic..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!customTopic.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowCustomInput(true)}
                className="mb-4 w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Custom Topic
              </button>
            )}

            {/* Custom Topics Badges */}
            <CustomTopicsBadges />

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => toggleTopic(topic.name)}
                  className={`p-3 rounded-lg border text-left hover:shadow-sm transition-all h-full ${
                    selectedTopics.includes(topic.name)
                      ? 'bg-indigo-50 border-indigo-400'
                      : 'bg-white border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex gap-2 items-start flex-1">
                      <span className="text-xl mt-0.5" role="img" aria-label={topic.name}>
                        {topic.icon}
                      </span>
                      <div className="space-y-1 flex-1">
                        <h3 className="text-sm font-medium text-gray-800">{topic.name}</h3>
                        <p className="text-xs text-gray-500">{topic.description}</p>
                      </div>
                    </div>
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 transition-all mt-1 ${
                      selectedTopics.includes(topic.name)
                        ? 'text-indigo-600'
                        : 'text-gray-300'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNavigateToArticles(selectedTopics)}
              disabled={selectedTopics.length === 0}
              className={`mt-6 w-full py-3 rounded-lg text-white font-medium transition-all duration-300 ${
                selectedTopics.length > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Continue with {selectedTopics.length} topics
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div ref={containerRef} className="p-8 max-h-[90vh] overflow-y-auto relative scroll-smooth">
            <BackButton />
            <div className="flex items-center justify-center mb-8">
              <Globe2 className="w-12 h-12 text-indigo-600 mr-4" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Basha AI
              </h1>
            </div>
            <ProgressBar />
            <div className="space-y-6">
              <div className="relative overflow-hidden">
                {renderStep()}
              </div>
              <div className="mt-8 flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <p>Powered by Chrome Built-In AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
