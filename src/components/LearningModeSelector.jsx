import { useNavigate } from "react-router-dom";
import { 
  BookOpen, MessageCircle, Lightbulb, ArrowLeft, Brain,
  GraduationCap, Book, PenTool, Languages, Code,
  Bot, Laptop, School, Cpu, BookOpenCheck,
  CircuitBoard, Binary, Monitor, BrainCircuit, 
  FileText, Notebook, Users, Target, Blocks,
  Sparkles, Globe, Puzzle
} from "lucide-react";

export default function LearningModeSelector() {
  const navigate = useNavigate();
  
  const backgroundIcons = [
    BookOpen, Brain, Lightbulb, GraduationCap, Book,
    PenTool, Languages, Code, Bot, Laptop,
    School, Cpu, BookOpenCheck,
    CircuitBoard, Binary, Monitor, BrainCircuit,
    FileText, Notebook, Users, Target, Blocks,
    Sparkles, Globe, Puzzle
  ];

  const learningModes = [
    {
      id: 'articles',
      icon: BookOpen,
      title: 'Learn from Articles',
      description: 'Read and learn from curated articles with interactive translations and exercises',
      features: [
        '3 difficulty levels with customizable content styles',
        'Interactive quizzes and exercises',
        'Vocabulary tooltips with translations',
        'Text-to-speech listening mode',
        'Summary writing with AI feedback',
        'AI Article Buddy for personalized help'
      ],
      color: 'from-indigo-500 to-purple-500',
      shadowColor: 'shadow-indigo-500/25',
      href: '/articles'
    },
    {
      id: 'conversations',
      icon: MessageCircle,
      title: 'Real-time Conversations',
      description: 'Practice through AI-powered conversations with instant feedback',
      features: [
        'Natural voice interactions with AI',
        'Multiple conversation scenarios',
        'Adaptive difficulty levels',
        'Ask for Grammar and vocabulary corrections',
        'Practice speaking and listening skills',
        'Personalized discussions based on your interests'
      ],
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
      href: '/conversations'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => { 
          const IconComponent = backgroundIcons[i % backgroundIcons.length];
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.15,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
              }}
            >
              <IconComponent 
                size={48}
                className="text-white"
              />
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border border-white/20">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                Choose Your Learning Path
              </h1>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {learningModes.map((mode) => (
                <div key={mode.id} className="relative group perspective-1000">
                  {mode.comingSoon && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => !mode.comingSoon && navigate(mode.href)}
                    disabled={mode.comingSoon}
                    className={`w-full h-full p-6 rounded-xl transition-all duration-500 
                      ${mode.comingSoon ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                      bg-gradient-to-br ${mode.color} ${mode.shadowColor} shadow-lg
                      border border-white/20 backdrop-blur-sm
                      hover:shadow-2xl hover:border-white/40
                      transform-gpu`}
                  >
                    <div className="flex flex-col h-full text-white">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                          <mode.icon className="w-6 h-6 group-hover:animate-bounce" />
                        </div>
                        <h2 className="text-xl font-semibold group-hover:text-white transition-colors">
                          {mode.title}
                        </h2>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {mode.description}
                      </p>
                      {mode.features && (
                        <ul className="mt-4 text-xs space-y-1 text-white/80">
                          {mode.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/60 mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}